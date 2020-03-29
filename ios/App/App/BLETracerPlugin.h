//
//  BLETracerPlugin.h
//  App
//
//  Created by Matteo Cortonesi on 29.03.20.
//

#import <Capacitor/Capacitor.h>

NS_ASSUME_NONNULL_BEGIN

@interface BLETracerPlugin : CAPPlugin

- (void)getCloseContacts:(CAPPluginCall *)call;

@end

NS_ASSUME_NONNULL_END
