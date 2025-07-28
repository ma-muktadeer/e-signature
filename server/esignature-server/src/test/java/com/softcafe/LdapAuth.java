package com.softcafe;

import java.util.Properties;

import javax.naming.Context;
import javax.naming.directory.InitialDirContext;

public class LdapAuth {
	
	public static void main(String...strings) {
		System.out.println("Auth");
		try {
			//authenticateJndi("kamrul","1");
			
			//System.out.println(Integer.toHexString(180010).toUpperCase());
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		
	}
	
	
	public static boolean authenticateJndi(String username, String password) throws Exception{
	    Properties props = new Properties();
	    props.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
	    props.put(Context.PROVIDER_URL, "ldap://localhost:10389");
	    props.put(Context.SECURITY_PRINCIPAL, "cn=kamrul,ou=users,ou=system");//adminuser - User with special priviledge, dn user
	    props.put(Context.SECURITY_CREDENTIALS, "1");//dn user password


	    InitialDirContext context = new InitialDirContext(props);
	    System.out.println("Connected");
	    return true;
	}

}
