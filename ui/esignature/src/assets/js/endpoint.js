var baseDev = "http://localhost:8080";



// var baseProdPBL = "https://192.168.203.166:8443";
// var baseProdPBL = "https://e-signature-app-db-uat:443";
// var baseProdPBL = "http://10.100.100.166:80";
var baseProdPBL = "https://e-signatureuat.primebank.com.bd";
// var baseProdPBL = "https://e-signature.primebank.com.bd";

function url_dev(){
    return baseDev+"/secure";
}

function url_dev_public(){
    return baseDev+"/public";
}

function url_dev_admin(){
    return baseDev+"/secure/admin";
}





//DHAKA_BANK,PRIME_BANK

var client = "PRIME_BANK";

function getClient(){
    return client;
}

function getLogoName(){
    if(client == 'PRIME_BANK'){
        return 'logo_prime.png';
      }
     
}

function getDomain(){
  if(client == 'PRIME_BANK'){
    return '@primebank.com.bd';
  }
 

  return '';
}

function getProdUrl(){
    if(client == 'PRIME_BANK'){
        return baseProdPBL;
      }
     
}

var baseProd = getProdUrl();

function url_prod(){
    return baseProd+"/esignature-server/secure";
}

function url_prod_public(){
    return baseProd+"/esignature-server/public";
}

function url_prod_admin(){
    return baseProd+"/esignature-server/secure/admin";
}
