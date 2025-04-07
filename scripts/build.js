#!/usr/bin/env node

/**
 * Clean build script for Keycloak Admin SDK
 * This script cleans the dist directory before building
 */

import { rm } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function build() {
  try {
    // Clean dist directory
    console.log('Cleaning dist directory...');
    await rm('./dist', { recursive: true, force: true });
    
    // Run rollup build
    console.log('Building library...');
    const { stdout, stderr } = await execAsync('rollup -c');
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
