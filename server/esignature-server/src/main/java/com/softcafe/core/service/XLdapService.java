package com.softcafe.core.service;

import java.util.Hashtable;
import java.util.Properties;

import javax.naming.Context;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import javax.naming.directory.InitialDirContext;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.softcafe.core.model.User;

@Service
public class XLdapService {
	private static final Logger log = LoggerFactory.getLogger(XLdapService.class);

	@Value("${ldap.server:LDAP://dhakabank.com.bd}")
	String server;

	@Value("${ldap.domain.default.username}")
	String defaultUsername;

	@Value("${ldap.domain.default.password}")
	String defaultPassword;
	
	@Value("${shouldPassDomainInSearch:false}")
	boolean shouldPassDomainInSearch;
	
	@Value("${ldap.base.dn:dc=primebank,dc=local}")
	String ldapBaseDn;
	
	
	@Value("${ldap.domain}")
	String domain;

	@Value("${ldap.load.user.details:true}")
	boolean loadUserDetails;

	@Value("${ldap.initial.ldap.context:true}")
	boolean useInitialLdapContext;

	public boolean authenticateWithLdap(String username, String password) throws Exception {
		log.debug("Trying to authenticate with username:password [{}]", username);
		log.debug("LDAP [{}]", server);
		
		String principal = username + domain;
		
		log.debug("ldap SECURITY_PRINCIPAL [{}]", principal);
		Properties props = new Properties();
		props.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
		props.put(Context.PROVIDER_URL, server);
		props.put(Context.SECURITY_PRINCIPAL, principal);
		props.put(Context.SECURITY_CREDENTIALS, password);
		props.put(Context.SECURITY_AUTHENTICATION, "simple");

		log.info("Trying to initialize...");
		InitialDirContext context = new InitialDirContext(props);
		log.info("LDAP auth success [{}]", username);
		LdapContext ctx = null;
		if (loadUserDetails) {
			try {
				ctx = getLdapContext(username, password);
				getUserBasicAttributes(username, ctx);
			}catch(Exception ex) {
				log.error("Error getting user details {}, ex");
			}
			
		}
		return true;
	}

	public LdapContext getLdapContext(String username, String password) {
		log.info("Trying to get LdapContext with username:password [{},{}]", username, password);
		log.info("LDAP server[{}]", server);
		LdapContext ctx = null;
		try {
			Hashtable<String, String> env = new Hashtable<String, String>();
			env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
			env.put(Context.SECURITY_AUTHENTICATION, "Simple");
			env.put(Context.SECURITY_PRINCIPAL, username + domain);
			env.put(Context.SECURITY_CREDENTIALS, password);
			env.put(Context.PROVIDER_URL, server);
			ctx = new InitialLdapContext(env, null);
			log.info("Ldap context successful");
		} catch (NamingException nex) {
			log.error("Error getting ldap context {}", nex);
		} catch (Exception nex) {
			log.error("Error getting ldap context {}", nex);
		}
		return ctx;
	}

	void getUserBasicAttributes(String username, LdapContext ctx) {
	    try {

	        SearchControls constraints = new SearchControls();
	        constraints.setSearchScope(SearchControls.SUBTREE_SCOPE);
	        String[] attrIDs = { "distinguishedName",
	                "sn",
	                "givenname",
	                "mail",
	                "telephonenumber"};
	        constraints.setReturningAttributes(attrIDs);
	        //First input parameter is search bas, it can be "CN=Users,DC=YourDomain,DC=com"
	        //Second Attribute can be uid=username
	        log.info("Search start.");
	        NamingEnumeration answer = ctx.search("DC=domain,DC=com", "sAMAccountName="
	                + "username", constraints);
	        log.info("Search complete. Getting attribute");
	        if (answer.hasMore()) {
	            Attributes attrs = ((SearchResult) answer.next()).getAttributes();
	            log.info("distinguishedName "+ attrs.get("distinguishedName"));
	            log.info("givenname "+ attrs.get("givenname"));
	            log.info("sn "+ attrs.get("sn"));
	            log.info("mail "+ attrs.get("mail"));
	            log.info("telephonenumber "+ attrs.get("telephonenumber"));
	            log.info("distinguishedName "+ attrs.get("distinguishedName"));
	        }else{
	            throw new Exception("Invalid User");
	        }

	    } catch (Exception ex) {
	        log.error("Error getting user details {}", ex);
	    }
	    
	}

	public User validateUser(String uname) throws Exception {
		User user = null;
		try {
			LdapContext context = getLdapContext(defaultUsername, defaultPassword);
			
			if(shouldPassDomainInSearch) {
				uname = uname.trim() + domain.trim();
			}

			user = getUserInfo(uname.trim(), context, getSearchControls());

		} catch (Exception e) {
			throw new Exception(e.getLocalizedMessage());
		}

		return user;
	}

	public User getUserInfo(String userName, LdapContext ctx, SearchControls searchControls) throws Exception {
		log.info("Searching name [{}]:[{}]", userName, ldapBaseDn);
		User user = null;
		try {
			NamingEnumeration<SearchResult> answer = ctx.search(ldapBaseDn, "sAMAccountName=" + userName,
					searchControls);
			log.info("Name Search complete");
			if (answer != null && answer.hasMore()) {
				log.info("Getting name...");
				user = new User();
				try {
					Attributes attrs = answer.next().getAttributes();
					String fullName = null;
					String mail = null;
					String telephonenumber = null;
					
					log.info("Getting givenname");
					if(attrs.get("givenname") != null && attrs.get("givenname").size() > 0) {
						fullName = attrs.get("givenname").get(0).toString();
						log.info("Full Name [{}]", fullName);
					}
					log.info("Getting mail");
					if(attrs.get("mail") != null && attrs.get("mail").size() > 0) {
						mail = attrs.get("mail").get(0).toString();
						
						log.info("Email [{}]", mail);
					}
					log.info("Getting telephonenumber");
					if(attrs.get("telephonenumber") != null && attrs.get("telephonenumber").size() > 0) {
						telephonenumber = attrs.get("telephonenumber").get(0).toString();
						
						log.info("Phone Number [{}]", telephonenumber);
					}
					
					log.info("distinguishedName => [{}]", attrs.get("distinguishedName"));
					log.info("sn => [{}]", attrs.get("sn"));
					log.info("givenname => [{}]", attrs.get("givenname"));
					log.info("mail => [{}]", attrs.get("mail"));
					log.info("telephonenumber => [{}]", attrs.get("telephonenumber"));
					user.setFullName(fullName);
					user.setEmail(mail);
					user.setPhoneNumber(telephonenumber);
				} catch (Exception e) {
					log.info("Exception getting attr {}", e);
				}
			} else {
				throw new Exception("User does not exist in the Ad server");
			}
		} 
		catch(javax.naming.PartialResultException xx) {
			throw new Exception("User does not exist in the Ad server");
		}
		catch (Exception ex) {
			log.error("Error getting user [{}]\n{}", userName, ex);
			throw new Exception("User Search error");
		}
		
		return user;
	}
	
	private static SearchControls getSearchControls() {
		SearchControls cons = new SearchControls();
		cons.setSearchScope(SearchControls.SUBTREE_SCOPE);
		String[] attrIDs = { "distinguishedName", "sn", "givenname", "mail", "telephonenumber", "thumbnailPhoto" };
		cons.setReturningAttributes(attrIDs);
		return cons;
	}
	

}


