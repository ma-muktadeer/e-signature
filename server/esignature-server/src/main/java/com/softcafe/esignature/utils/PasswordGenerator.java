package com.softcafe.esignature.utils;

import java.security.SecureRandom;

public class PasswordGenerator {

    // Characters to be used in generating passwords
    private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL = "!@#$%^&*-_=+";

    // Method to generate a random password
    public static String generatePassword(int length) {
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        // Ensure at least one character from each category
        password.append(UPPER.charAt(random.nextInt(UPPER.length())));
        password.append(LOWER.charAt(random.nextInt(LOWER.length())));
        password.append(DIGITS.charAt(random.nextInt(DIGITS.length())));
        password.append(SPECIAL.charAt(random.nextInt(SPECIAL.length())));

        // Generate remaining characters
        for (int i = 4; i < length; i++) {
            String chars = UPPER + LOWER + DIGITS + SPECIAL;
            password.append(chars.charAt(random.nextInt(chars.length())));
        }

        // Shuffle the characters in the password
        String shuffledPassword = shuffleString(password.toString());
        return shuffledPassword;
    }

    // Method to shuffle characters in the password
    private static String shuffleString(String string) {
        char[] charArray = string.toCharArray();
        SecureRandom random = new SecureRandom();
        for (int i = 0; i < charArray.length; i++) {
            int randomIndex = random.nextInt(charArray.length);
            char temp = charArray[i];
            charArray[i] = charArray[randomIndex];
            charArray[randomIndex] = temp;
        }
        return new String(charArray);
    }

//    public static void main(String[] args) {
//        // Generate a password with length at least 12
//        String password = generatePassword(12);
//        System.out.println("Generated Password: " + password);
//    }
}
