package com.softcafe.core.util;

import com.delfian.core.jdbc.sql.SQLBuilder;

public class Db {
	static String in  = "D:\\BUILD_TEST";
	public static void mainX(String[] args) {
		SQLBuilder.build(in);
	}

}
