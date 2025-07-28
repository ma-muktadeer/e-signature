package com.softcafe.esignature.utils;

import java.security.Key;
import java.security.Security;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class EncryptDecryptHelper {
    private static final Logger log = LoggerFactory.getLogger(EncryptDecryptHelper.class);
    
    static {
        Security.addProvider(new BouncyCastleProvider());
    }
	
	
	private static final String ALGO = "AES/ECB/PKCS5Padding";

	public String encrypt(String Data, String secret) throws Exception {
		Key key = generateKey(encodeKey(secret));
		Cipher c = Cipher.getInstance(ALGO);
		c.init(Cipher.ENCRYPT_MODE, key);
		byte[] encVal = c.doFinal(Data.getBytes());
		String encryptedValue = Base64.getEncoder().encodeToString(encVal);
		return encryptedValue;
	}

	public String decrypt(String strToDecrypt, String secret) {

		try {

			Key key = generateKey(encodeKey(secret));
			Cipher cipher = Cipher.getInstance(ALGO);
			cipher.init(Cipher.DECRYPT_MODE, key);
			return new String(cipher.doFinal(Base64.getDecoder().decode(strToDecrypt)));
		} catch (Exception e) {
			log.info("Error while decrypting: {}", e.toString());
		}
		return null;
	}

	private Key generateKey(String secret) throws Exception {
		byte[] decoded = Base64.getDecoder().decode(secret.getBytes());
		Key key = new SecretKeySpec(decoded, "AES");
		return key;
	}

	private String decodeKey(String str) {
		byte[] decoded = Base64.getDecoder().decode(str.getBytes());
		return new String(decoded);
	}

	public String encodeKey(String myKey) {
//		try {
//			byte[] key = myKey.getBytes("UTF-8");
//			MessageDigest sha = MessageDigest.getInstance("SHA-1");
//            key = sha.digest(key);
////          System.out.println(key);
//            key = Arrays.copyOf(key, 10);
//            return new SecretKeySpec(key, "AES").toString();          
//        }
//        catch (NoSuchAlgorithmException e) {
//            e.printStackTrace();
//        }
//        catch (UnsupportedEncodingException e) {
//            e.printStackTrace();
//        }
//		return null;
		byte[] encoded = Base64.getEncoder().encode(myKey.getBytes());
		String s = new String(encoded);
		return s;
	}

}
