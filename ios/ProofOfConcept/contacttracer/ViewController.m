//
//  ViewController.m
//  contacttracer
//
//  Created by Matteo Cortonesi on 28.03.20.
//  Copyright © 2020 Matteo Cortonesi. All rights reserved.
//

#import "ViewController.h"

#import "ContactsLogger.h"

@interface ViewController ()

@end

@implementation ViewController {
  ContactsLogger *_contactsLogger;
}

- (void)viewDidLoad {
  [super viewDidLoad];
  _contactsLogger = [[ContactsLogger alloc] init];
  
  [NSTimer scheduledTimerWithTimeInterval:1 repeats:YES block:^(NSTimer * _Nonnull timer) {
    NSUInteger since = [[NSDate dateWithTimeIntervalSinceNow:-10] timeIntervalSince1970] * 1000;
    NSArray<NSDictionary<NSString *, id> *> *closeContacts = [self->_contactsLogger closeContactsSince:since];
    NSLog(@"%@", closeContacts);
  }];
}



@end
