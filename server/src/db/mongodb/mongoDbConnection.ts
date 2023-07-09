import mongoose  from 'mongoose';

export interface MongoDbConnectionParams {
  // Mongodb RRI.
  // E.g. mongodb://localhost:27017/my-alarm-app
  uri: string,
  // Mongoone connction options.
  //E.g.
  //{
  //  keepAlive: true,
  //  socketTimeoutMS: 3000,
  //  connectTimeoutMS: 3000,
  //}
  connectionOptions?: mongoose.ConnectOptions
}

export class MongoDbConnection {

  private static dbParams: MongoDbConnectionParams

  public static async connect(params: MongoDbConnectionParams ) : Promise<void> {
    try{
      this.dbParams = params
      this.setupCallbackListeners()
      this.openDbConnection()
    } catch(error){
      console.error("Creation of the MongoDB connection failed: " + error);
      throw error;
    }
  }

  public static async disconnect(){
    try{
      mongoose.disconnect()
    }catch(error){
      console.log(error);
      throw error;
    }
  }
  
  private static setupCallbackListeners() {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connection established successfully')
    })

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB connection re-established successfully')
    })

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB connection disconnected')
      console.log('Trying to reconnect to MongoDB ...')
      setTimeout(() => {
        this.openDbConnection()
      }, 3000)
    })

    mongoose.connection.on('close', () => {
      console.log('MongoDB Connection Closed')
    })

    mongoose.connection.on('error', (error: Error) => {
      console.log('MongoDB Connection ERROR: ' + error)
    })    
  }

  private static openDbConnection(){
    if(typeof this.dbParams.connectionOptions === 'undefined'){
      mongoose.connect(this.dbParams.uri)
    }else{
      mongoose.connect(this.dbParams.uri, this.dbParams.connectionOptions)
    }
  }
}
