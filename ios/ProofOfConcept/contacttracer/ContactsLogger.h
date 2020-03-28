//
//  ContactsLogger.h
//  contacttracer
//
//  Created by Matteo Cortonesi on 28.03.20.
//  Copyright © 2020 Matteo Cortonesi. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface ContactsLogger : NSObject

+ (instancetype)sharedInstance;

// timeinterval is a unix timestamp in milliseconds.
- (NSArray<NSDictionary<NSString *, id> *> *)closeContactsSince:(NSUInteger)timeinterval;

@end

NS_ASSUME_NONNULL_END
