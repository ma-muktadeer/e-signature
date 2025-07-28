package com.softcafe.esignature.utils;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

public class DocumentFielsUtils {
	
	public static Resource getFileAsResource(String path) {
		try {
			Path filePath = Paths.get(path);
			return new UrlResource(filePath.toUri());
		} catch (Exception e) {
			return null;
		}
		
		
	}

}
