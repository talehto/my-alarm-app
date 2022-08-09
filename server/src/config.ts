// https://dev.to/asjadanis/parsing-env-with-typescript-3jjm

import path from "path";
import dotenv from "dotenv";

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  SERVER_PORT: number | undefined;
  MONGO_URI: string | undefined;
}

interface Config {
  SERVER_PORT: number;
  MONGO_URI: string;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    SERVER_PORT: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : undefined,
    MONGO_URI: process.env.MONGO_URI
  };
};

// Throwing an Error if any field was undefined we don't 
// want our app to run if it can't connect to DB and ensure 
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type 
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
