//
//  Contact.h
//  contacttracer
//
//  Created by Matteo Cortonesi on 28.03.20.
//  Copyright © 2020 Matteo Cortonesi. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface Contact : NSObject

- (instancetype)initWithIdentifier:(NSString *)identifier firstSeen:(NSTimeInterval)firstSeen;

@property (nonatomic, readonly) NSString *identifier;

@property (nonatomic, assign, readonly) NSTimeInterval firstSeen;

@end

NS_ASSUME_NONNULL_END
