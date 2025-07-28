package com.softcafe.core.util;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.PropertyUtils;

public class CF {
	
	public static void fillInsert(Object obj) throws Exception {
		PropertyUtils.setProperty(obj, CommonProp.active, 1);
		PropertyUtils.setProperty(obj, CommonProp.modDate, new Date());
		PropertyUtils.setProperty(obj, CommonProp.createDate,  new Date());
	}
	
	public static void fillUpdate(Object obj) throws Exception {
		PropertyUtils.setProperty(obj, CommonProp.modDate, new Date());
	}
	
    public static <T> List<T> mapRows(final Class<T> clazz, final Map<String, String> rs2BeanMap, final ResultSet rs) throws Exception {
        final List<T> arrayList = new ArrayList<T>();
        if (rs2BeanMap != null && rs != null) {
            T newInstance = null;
            while (rs.next()) {
                newInstance = clazz.newInstance();
                for (final Map.Entry<String, String> entry : rs2BeanMap.entrySet()) {
                    final Object value = rs.getObject(entry.getKey());
                    if (value != null) {
                        BeanUtils.setProperty((Object)newInstance, entry.getValue(), value);
                    }
                }
                arrayList.add(newInstance);
            }
        }
        return arrayList;
    }

}
