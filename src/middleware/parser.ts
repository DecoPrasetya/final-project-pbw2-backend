import express from 'express';
import cookieParser from 'cookie-parser';

export const parser = [
  express.json({ limit: '2mb' }),
  express.urlencoded({ extended: true }),
  cookieParser(),
];