//
//  ViewController.m
//  contacttracer
//
//  Created by Matteo Cortonesi on 28.03.20.
//  Copyright © 2020 Matteo Cortonesi. All rights reserved.
//

#import "ViewController.h"

#import <CoreBluetooth/CoreBluetooth.h>

@interface ViewController () <CBPeripheralManagerDelegate>

@end

@implementation ViewController {
  CBPeripheralManager *_peripheralManager;
}

- (void)viewDidLoad {
  [super viewDidLoad];

  _peripheralManager = [[CBPeripheralManager alloc] initWithDelegate:self queue:nil];
}

#pragma mark - CBPeripheralDelegate

- (void)peripheralManagerDidUpdateState:(CBPeripheralManager *)peripheral {
  if (peripheral.state == CBManagerStatePoweredOn) {
    CBCharacteristic *characteristic = [[CBMutableCharacteristic alloc]
                                        initWithType:[CBUUID UUIDWithString:@"FD8F77E5-5DAB-41D7-B88E-95B7A167CC40"]
                                        properties:CBCharacteristicPropertyRead
                                        value:[NSData dataWithBytes:"1" length:1]
                                        permissions:CBAttributePermissionsReadable];
    CBMutableService *service = [[CBMutableService alloc] initWithType:[CBUUID UUIDWithString:@"5E410C21-1CE6-4BDB-9576-2C6406AAC07C"]
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

#pragma mark - Private


@end
