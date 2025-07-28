
  export class WsUtils{

    public static genSubscribeUrl(arg1 : Number, arg2 : Number) : string{
        if(arg1 > arg2){
            return arg1 + "_" + arg2;
        }
        return arg2 + "_" + arg1;
    }

  }