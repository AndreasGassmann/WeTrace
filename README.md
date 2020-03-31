# WeTrace, a privacy focused mobile COVID-19 tracing App

Find out if you were in contact with someone that was tested positive.

## What it does

Please read our post on [WeTrace on Devpost](https://devpost.com/software/wetrace-g9ocyi) for more information about what the app does.

## Privacy

### Decentralized Asymmetric Opt-In Information System

The system we propose uses concepts used in privacy-first blockchain projects such as the ZCash project (TODO reference). Using a combination of those concepts in conjunction with Bluetooth Low Energy technology we are able to come up with a system, that has the following properties:

- Data of close contacts stays only on the device, is never shared with a central server.
- Users collect locally close contacts (<2m) on their device, together with the timestamp of when the contact happened and rough geolocation of where the contact happened.
- In case of a infection report, only the users that have been in close contact will be notified, the central server cannot read those messages and has the sole purpose of relaying the message.
- The user reporting the infection can decide whether he/she wants to:
    1. report only the infeciton to the close contacts of the last 14 days
    2. report the above _and_ the timestamp of when that close contact has taken place
    3. report the above _and_ the geolocation of where the close contact has taken place

### How the system works

How the system Works is best explained with an example. For this example we have User A with Device A, User B with Device B and User C with Device C.

1. Every device that installs the WeTrace app generates an asymmetric key pair using elliptic curve cryptography. For this examples sake PK_A stands for public key of Device A and SK_A stands for secret key of Device A. So in this step we generated PK_A, PK_B, PK_C and respectively SK_A, SK_B, SK_C.
2. Every device starts broadcasting to its surrounding their PK_* this is also their unique identifier.
3. When now 2 devices (i.e. A and B) meet in close contact, Device A knows PK_B and Device B knows PK_A. Both devices store from the contact besides the PK_* also: a timestamp, the geolocation where the encounter happened.
4. When User A is now infected and wants to report it, the Device will go through the list of close Contacts and encrypt a message with the public key of every contact. In our case, it will be encrypted once with PK_B because this was our only contact. All those messages will be sent to the central backend that will relay them to all devices. The messages will contain the data that User A chose to share, so either only the fact that an infection happened, or additionally when or even where it happened. Important: Only the reporting user decides if he/she wants to share this information.
5. Device B and Device C receive from the backend a notification telling them that new reports have happened. Device B will then try to decrypt every message with SK_B and will eventually find out that a message was directed at him/her. Device C will do the same, however because no message was encrypted with PB_C, no message can be decrypted.

Now that the crypto system is outlined the remaining "privacy issue" that is unsolved is the fact that someone could start tracking a users' location by simply scanning his/her advertising packets. Now the mitigation there is very simple, for simplicity's sake we said that in step 1 the device generates a keypair, however what actually happens is that the user generate a so called master seed. This master seed is used to derive deterministically an unlimited number of keypairs. This means the user will actually be changing the key in a specified period of time (like e.g. 30 min), making him/her only traceable with that public key only for that time frame. The elegance of this system is that the user still only stores 1 master seed and basically tries then with all of his/her keys from the last 14 days to decrypt the message. 

## Installation

### Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

#### Prerequisites

You will need `node` to build and run this project.

For `iOS` you will also need `XCode` and `cocoapods`.

For `android` you will need `Android Studio`.

#### Installing

```
git clone https://github.com/AndreasGassmann/WeTrace

cd WeTrace

npm install # To install all the dependencies

# OPTIONAL
ionic serve # for development in the browser

ionic build # to build the app

# FOR IOS
npx cap sync ios # Update native iOS project
npx cap open ios # Open XCode

# FOR ANDROID
npx cap sync android # Update native android project
npx cap open android # Open Android Studio

```

### Built With

* [Ionic](https://ionicframework.com/)
* [Capacitor](https://capacitor.ionicframework.com/)

### Contributing

Coming soon

### License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

### Acknowledgments

* Thanks to the [CodeVsCovid19](https://www.codevscovid19.org/) hackathon for giving us access to mentors who gave us valuable feedback.
