//
//  BLETracerPlugin.m
//  App
//
//  Created by Matteo Cortonesi on 29.03.20.
//

#import "BLETracerPlugin.h"

#import "ContactsLogger.h"

@implementation BLETracerPlugin

- (void)getCloseContacts:(CAPPluginCall *)call {
    id arg = call.options[@"sinceTimestamp"];
    if ([arg isKindOfClass:[NSNumber class]]) {
        NSUInteger sinceTimestamp = [(NSNumber *)arg unsignedIntegerValue];
        NSArray<NSDictionary<NSString *, id> *> *closeContacts = [[ContactsLogger sharedInstance] closeContactsSince:sinceTimestamp];
        NSDictionary *result = @{@"result": closeContacts};
        CAPPluginCallResult *pluginResult = [[CAPPluginCallResult alloc] init:result];
        call.successHandler(pluginResult, call);
    }
}

@end

@interface BLETracerPlugin (CAPPluginCategory) <CAPBridgedPlugin>
@end

@implementation BLETracerPlugin (CAPPluginCategory)

+ (NSArray *)pluginMethods {
    NSMutableArray *methods = [NSMutableArray new];
    [methods addObject:[[CAPPluginMethod alloc] initWithName:@"getCloseContacts" returnType:@"promise"]];
    return methods;
}

+ (CAPPluginMethod *)getMethod:(NSString *)methodName {
    NSArray *methods = [self pluginMethods];
    
    for(CAPPluginMethod *method in methods) {
        if([method.name isEqualToString:methodName]) {
            return method;
        }
    }
    
    return ((void *)0);
}

+ (NSString *)pluginId {
    return @"BLETracerPlugin";
}

+ (NSString *)jsName {
    return @"BLETracerPlugin";
}

@end
