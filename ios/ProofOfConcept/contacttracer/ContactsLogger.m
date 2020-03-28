//
//  ContactsLogger.m
//  contacttracer
//
//  Created by Matteo Cortonesi on 28.03.20.
//  Copyright © 2020 Matteo Cortonesi. All rights reserved.
//

#import "ContactsLogger.h"

#import <CoreBluetooth/CoreBluetooth.h>

#import "Contact.h"

@interface ContactsLogger () <CBPeripheralManagerDelegate, CBCentralManagerDelegate>
@end

static NSString * const kServiceUUIDPrefix = @"B6F4";

// NSUserDefaults key.
static NSString * const kCloseContactsKey = @"closeContacts";

// Contact keys.
static NSString * const kContactDeviceIDKey = @"deviceId";
static NSString * const kContactFirstEncounteredKey = @"firstEncountered";
static NSString * const kContactLastEncounteredKey = @"lastEncountered";


@implementation ContactsLogger {
  CBPeripheralManager *_peripheralManager;
  CBCentralManager *_centralManager;
  NSMutableSet<Contact *> *_closeContacts;
  NSMutableSet<Contact *> *_possibleCloseContacts;
}

+ (id)sharedInstance {
  static ContactsLogger *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[self alloc] init];
  });
  return sharedInstance;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    _peripheralManager = [[CBPeripheralManager alloc] initWithDelegate:self queue:nil];
    _centralManager = [[CBCentralManager alloc] initWithDelegate:self queue:nil];
    _closeContacts = [NSMutableSet new];
  }
  return self;
}

- (NSArray<NSDictionary<NSString *, id> *> *)closeContactsSince:(NSUInteger)timeinterval {
  NSMutableArray<NSDictionary<NSString *, id> *> *result = [NSMutableArray new];

  NSArray<NSDictionary<NSString *, id> *> *closeContacts = [self closeContacts];
  for (NSDictionary<NSString *, id> *contact in closeContacts) {
    if ([contact[kContactLastEncounteredKey] integerValue] > timeinterval) {
      [result addObject:contact];
    }
  }

  return result;
}

#pragma mark - CBPeripheralDelegate

- (void)peripheralManagerDidUpdateState:(CBPeripheralManager *)peripheral {
  if (peripheral.state == CBManagerStatePoweredOn) {
    CBCharacteristic *characteristic = [[CBMutableCharacteristic alloc]
                                        initWithType:[CBUUID UUIDWithString:@"FD8F77E5-5DAB-41D7-B88E-95B7A167CC40"]
                                        properties:CBCharacteristicPropertyRead
                                        value:[NSData dataWithBytes:"1" length:1]
                                        permissions:CBAttributePermissionsReadable];
    CBMutableService *service = [[CBMutableService alloc] initWithType:[self deviceUUID]
                                                               primary:YES];
    service.characteristics = @[characteristic];

    [_peripheralManager addService:service];
  }
}

- (void)peripheralManager:(CBPeripheralManager *)peripheral didAddService:(CBService *)service error:(NSError *)error {
  if (error) {
    NSLog(@"Error publishing service: %@", [error localizedDescription]);
    return;
  }

  [_peripheralManager startAdvertising:@{CBAdvertisementDataServiceUUIDsKey: @[service.UUID]}];
}

- (void)peripheralManagerDidStartAdvertising:(CBPeripheralManager *)peripheral error:(NSError *)error {
  if (error) {
    NSLog(@"Error start advertising: %@", [error localizedDescription]);
    return;
  }

  NSLog(@"Advertising started.");
}

#pragma mark - CBCentralManagerDelegate

- (void)centralManagerDidUpdateState:(CBCentralManager *)central {
  if (central.state == CBManagerStatePoweredOn) {
    [central scanForPeripheralsWithServices:nil options:@{CBCentralManagerScanOptionAllowDuplicatesKey: @YES}];
  }
}

- (void)centralManager:(CBCentralManager *)central
 didDiscoverPeripheral:(CBPeripheral *)peripheral
     advertisementData:(NSDictionary<NSString *, id> *)advertisementData
                  RSSI:(NSNumber *)RSSI {
  NSArray<CBUUID *> *peripheralServices = advertisementData[CBAdvertisementDataServiceUUIDsKey];
  for (CBUUID *serviceUUID in peripheralServices) {
    if ([serviceUUID.UUIDString hasPrefix:kServiceUUIDPrefix]) {
      [self saveContactIfNotAlreadySavedWithIdentifier:serviceUUID.UUIDString];
      return;
    }
  }
}

#pragma mark - Private

- (CBUUID *)deviceUUID {
  static NSString * const kDeviceUUIDKey = @"deviceUUID";
  NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
  NSString *deviceUUID = [userDefaults objectForKey:kDeviceUUIDKey];
  if (!deviceUUID) {
    deviceUUID = [NSString stringWithFormat:@"%@%@-%@-%@-%@-%@",
                  kServiceUUIDPrefix,
                  [[self class] randomHexStringOfLength:4],
                  [[self class] randomHexStringOfLength:4],
                  [[self class] randomHexStringOfLength:4],
                  [[self class] randomHexStringOfLength:4],
                  [[self class] randomHexStringOfLength:12]];
    [userDefaults setObject:deviceUUID forKey:kDeviceUUIDKey];
  }
  return [CBUUID UUIDWithString:deviceUUID];
}

+ (NSString *)randomHexStringOfLength:(NSUInteger)length {
  static NSString * const letters = @"0123456789ABCDEF";
  NSMutableString *result = [NSMutableString stringWithCapacity:length];

  for (int i=0; i<length; i++) {
    [result appendFormat: @"%C", [letters characterAtIndex:arc4random_uniform((unsigned int)[letters length])]];
  }

  return result;
}

- (void)saveContactIfNotAlreadySavedWithIdentifier:(NSString *)identifier {
  NSMutableArray<NSDictionary<NSString *, id> *> *closeContacts = [[self closeContacts] mutableCopy];

  __block NSUInteger contactToUpdateIndex;
  __block NSMutableDictionary<NSString *,id> *newContact;
  [closeContacts enumerateObjectsUsingBlock:^(NSDictionary<NSString *,id> *contact, NSUInteger index, BOOL *stop) {
    NSString *contactUUID = (NSString *)contact[kContactDeviceIDKey];
    if ([contactUUID isEqualToString:identifier]) {
      contactToUpdateIndex = index;
      newContact = [contact mutableCopy];
      newContact[kContactLastEncounteredKey] = @([[NSDate now] timeIntervalSince1970] * 1000);
      *stop = YES;
    }
  }];
  if (newContact) {
    [closeContacts replaceObjectAtIndex:contactToUpdateIndex withObject:newContact];
  } else {
    NSDictionary<NSString *, id> *contact = @{
      kContactDeviceIDKey: identifier,
      kContactFirstEncounteredKey: @([[NSDate now] timeIntervalSince1970] * 1000),
      kContactLastEncounteredKey: @([[NSDate now] timeIntervalSince1970] * 1000)
    };
    [closeContacts addObject:contact];
  }

  [self saveCloseContacts:closeContacts];
}

- (NSArray<NSDictionary<NSString *, id> *> *)closeContacts {
  NSArray<NSDictionary<NSString *, id> *> *closeContacts = [[NSUserDefaults standardUserDefaults] objectForKey:kCloseContactsKey];
  if (!closeContacts) {
    closeContacts = [NSArray new];
  }
  return closeContacts;
}

- (void)saveCloseContacts:(NSArray<NSDictionary<NSString *, id> *> *)closeContacts {
  [[NSUserDefaults standardUserDefaults] setObject:closeContacts forKey:kCloseContactsKey];
}

@end
