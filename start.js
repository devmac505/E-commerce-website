console.log('Starting dependency check...');

try {
  // Try to require each dependency one by one
  console.log('Checking for express...');
  const express = require('express');
  console.log('Express is available');

  console.log('Checking for mongoose...');
  const mongoose = require('mongoose');
  console.log('Mongoose is available');

  console.log('Checking for morgan...');
  const morgan = require('morgan');
  console.log('Morgan is available');

  console.log('Checking for cors...');
  const cors = require('cors');
  console.log('Cors is available');

  console.log('Checking for path...');
  const path = require('path');
  console.log('Path is available');

  console.log('Checking for dotenv...');
  const dotenv = require('dotenv');
  console.log('Dotenv is available');
  
  console.log('All core dependencies are available');
  
  // Try to load config
  console.log('Trying to load config...');
  try {
    const config = require('./config');
    console.log('Config loaded successfully:', config);
  } catch (configError) {
    console.error('Error loading config:', configError.message);
  }

} catch (error) {
  console.error('ERROR: Missing dependency - ' + error.message);
  console.error('Please install dependencies with: npm install');
  console.error('If you have PowerShell restrictions, try running PowerShell as Administrator');
}

console.log('Dependency check complete.'); 