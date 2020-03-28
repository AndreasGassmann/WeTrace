//
//  Contact.m
//  contacttracer
//
//  Created by Matteo Cortonesi on 28.03.20.
//  Copyright © 2020 Matteo Cortonesi. All rights reserved.
//

#import "Contact.h"

@implementation Contact

- (instancetype)initWithIdentifier:(NSString *)identifier firstSeen:(NSTimeInterval)firstSeen {
  self = [super init];
  if (self) {
    _identifier = identifier;
    _firstSeen = firstSeen;
  }
  return self;
}



@end
