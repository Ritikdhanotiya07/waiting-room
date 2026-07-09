#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import { VirtualWaitingRoomStack } from './virtual-waiting-room-stack';

const app = new cdk.App();

new VirtualWaitingRoomStack(app, 'VirtualWaitingRoomStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});
