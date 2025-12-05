package com.baccano.iot.common.utils;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.CharUtils;
import org.apache.commons.lang3.StringEscapeUtils;

import java.util.Arrays;
import java.util.Collection;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 字符串工具类，扩展Apache Commons Lang3的StringUtils
 *
 * @author baccano-iot
 */
public class StringUtils extends org.apache.commons.lang3.StringUtils {
    /**
     * 空字符串
     */
    public static final String EMPTY = "";

    /**
     * 空格字符串
     */
    public static final String SPACE = " ";

    /**
     * 换行符
     */
    public static final String LF = "\n";

    /**
     * 制表符
     */
    public static final String TAB = "\t";

    /**
     * 下划线
     */
    public static final String UNDERLINE = "_";

    /**
     * 中划线
     */
    public static final String DASH = "-";

    /**
     * 逗号
     */
    public static final String COMMA = ",";

    /**
     * 句号
     */
    public static final String DOT = ".";

    /**
     * 左大括号
     */
    public static final String LEFT_BRACE = "{";

    /**
     * 右大括号
     */
    public static final String RIGHT_BRACE = "}";

    /**
     * 左中括号
     */
    public static final String LEFT_BRACKET = "[";

    /**
     * 右中括号
     */
    public static final String RIGHT_BRACKET = "]";

    /**
     * 左小括号
     */
    public static final String LEFT_PARENTHESIS = "(";

    /**
     * 右小括号
     */
    public static final String RIGHT_PARENTHESIS = ")";

    /**
     * 冒号
     */
    public static final String COLON = ":";

    /**
     * 分号
     */
    public static final String SEMICOLON = ";";

    /**
     * 等号
     */
    public static final String EQUAL = "=";

    /**
     * 正则：手机号
     */
    public static final String REGEX_MOBILE = "^1[3-9]\\d{9}$";

    /**
     * 正则：邮箱
     */
    public static final String REGEX_EMAIL = "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$";

    /**
     * 正则：身份证号
     */
    public static final String REGEX_ID_CARD = "^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$";

    /**
     * 正则：URL
     */
    public static final String REGEX_URL = "^((https|http|ftp|rtsp|mms)?:\\/\\/)[^\\s]+";

    /**
     * 正则：IP地址
     */
    public static final String REGEX_IP = "^((2[0-4]\\d|25[0-5]|[01]?\\d\\d?)\\.){3}(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)$";

    /**
     * 校验是否为手机号
     *
     * @param mobile 手机号
     * @return 是否为手机号
     */
    public static boolean isMobile(String mobile) {
        if (isBlank(mobile)) {
            return false;
        }
        return Pattern.matches(REGEX_MOBILE, mobile);
    }

    /**
     * 校验是否为邮箱
     *
     * @param email 邮箱
     * @return 是否为邮箱
     */
    public static boolean isEmail(String email) {
        if (isBlank(email)) {
            return false;
        }
        return Pattern.matches(REGEX_EMAIL, email);
    }

    /**
     * 校验是否为身份证号
     *
     * @param idCard 身份证号
     * @return 是否为身份证号
     */
    public static boolean isIdCard(String idCard) {
        if (isBlank(idCard)) {
            return false;
        }
        return Pattern.matches(REGEX_ID_CARD, idCard);
    }

    /**
     * 校验是否为URL
     *
     * @param url URL
     * @return 是否为URL
     */
    public static boolean isUrl(String url) {
        if (isBlank(url)) {
            return false;
        }
        return Pattern.matches(REGEX_URL, url);
    }

    /**
     * 校验是否为IP地址
     *
     * @param ip IP地址
     * @return 是否为IP地址
     */
    public static boolean isIp(String ip) {
        if (isBlank(ip)) {
            return false;
        }
        return Pattern.matches(REGEX_IP, ip);
    }

    /**
     * 驼峰转下划线
     *
     * @param str 驼峰字符串
     * @return 下划线字符串
     */
    public static String camelToUnderline(String str) {
        if (isBlank(str)) {
            return str;
        }
        StringBuilder sb = new StringBuilder();
        char[] chars = str.toCharArray();
        for (char c : chars) {
            if (CharUtils.isAsciiAlphaUpper(c)) {
                sb.append(UNDERLINE).append(CharUtils.toString(c).toLowerCase());
            } else {
                sb.append(c);
            }
        }
        return sb.toString().replaceFirst(UNDERLINE, EMPTY);
    }

    /**
     * 下划线转驼峰
     *
     * @param str 下划线字符串
     * @return 驼峰字符串
     */
    public static String underlineToCamel(String str) {
        if (isBlank(str)) {
            return str;
        }
        StringBuilder sb = new StringBuilder();
        String[] words = str.split(UNDERLINE);
        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            if (i == 0) {
                sb.append(word.toLowerCase());
            } else {
                sb.append(capitalize(word.toLowerCase()));
            }
        }
        return sb.toString();
    }

    /**
     * 首字母大写
     *
     * @param str 字符串
     * @return 首字母大写的字符串
     */
    public static String capitalize(String str) {
        if (isBlank(str)) {
            return str;
        }
        return CharUtils.toString(str.charAt(0)).toUpperCase() + str.substring(1);
    }

    /**
     * 首字母小写
     *
     * @param str 字符串
     * @return 首字母小写的字符串
     */
    public static String uncapitalize(String str) {
        if (isBlank(str)) {
            return str;
        }
        return CharUtils.toString(str.charAt(0)).toLowerCase() + str.substring(1);
    }

    /**
     * 字符串转数组
     *
     * @param str     字符串
     * @param split   分隔符
     * @param trim    是否去除空格
     * @param ignoreEmpty 是否忽略空字符串
     * @return 数组
     */
    public static String[] split(String str, String split, boolean trim, boolean ignoreEmpty) {
        if (isBlank(str)) {
            return ArrayUtils.EMPTY_STRING_ARRAY;
        }
        String[] array = str.split(split);
        if (array.length == 0) {
            return ArrayUtils.EMPTY_STRING_ARRAY;
        }
        if (trim || ignoreEmpty) {
            for (int i = 0; i < array.length; i++) {
                if (trim) {
                    array[i] = array[i].trim();
                }
            }
        }
        if (ignoreEmpty) {
            return Arrays.stream(array).filter(s -> !isBlank(s)).toArray(String[]::new);
        }
        return array;
    }

    /**
     * 字符串转数组
     *
     * @param str   字符串
     * @param split 分隔符
     * @return 数组
     */
    public static String[] split(String str, String split) {
        return split(str, split, true, true);
    }

    /**
     * 数组转字符串
     *
     * @param array  数组
     * @param split  分隔符
     * @return 字符串
     */
    public static String join(Object[] array, String split) {
        if (ArrayUtils.isEmpty(array)) {
            return EMPTY;
        }
        return join(Arrays.asList(array), split);
    }

    /**
     * 集合转字符串
     *
     * @param collection 集合
     * @param split      分隔符
     * @return 字符串
     */
    public static String join(Collection<?> collection, String split) {
        if (collection == null || collection.isEmpty()) {
            return EMPTY;
        }
        StringBuilder sb = new StringBuilder();
        for (Object obj : collection) {
            if (obj != null) {
                sb.append(obj.toString()).append(split);
            }
        }
        return sb.toString().substring(0, sb.length() - split.length());
    }

    /**
     * 判断对象是否为空
     *
     * @param obj 对象
     * @return 是否为空
     */
    public static boolean isEmpty(Object obj) {
        if (obj == null) {
            return true;
        }
        if (obj instanceof String) {
            return isBlank((String) obj);
        }
        if (obj instanceof Collection) {
            return ((Collection<?>) obj).isEmpty();
        }
        if (obj instanceof Map) {
            return ((Map<?, ?>) obj).isEmpty();
        }
        if (obj.getClass().isArray()) {
            return java.lang.reflect.Array.getLength(obj) == 0;
        }
        return false;
    }

    /**
     * 判断对象是否不为空
     *
     * @param obj 对象
     * @return 是否不为空
     */
    public static boolean isNotEmpty(Object obj) {
        return !isEmpty(obj);
    }

    /**
     * 字符串脱敏
     *
     * @param str     字符串
     * @param start   保留开始字符数
     * @param end     保留结束字符数
     * @param replace 替换字符
     * @return 脱敏后的字符串
     */
    public static String mask(String str, int start, int end, char replace) {
        if (isBlank(str)) {
            return str;
        }
        int length = str.length();
        if (start + end >= length) {
            return str;
        }
        StringBuilder sb = new StringBuilder();
        sb.append(str.substring(0, start));
        for (int i = 0; i < length - start - end; i++) {
            sb.append(replace);
        }
        sb.append(str.substring(length - end));
        return sb.toString();
    }

    /**
     * 手机号脱敏
     *
     * @param mobile 手机号
     * @return 脱敏后的手机号
     */
    public static String maskMobile(String mobile) {
        if (isBlank(mobile)) {
            return mobile;
        }
        return mask(mobile, 3, 4, '*');
    }

    /**
     * 邮箱脱敏
     *
     * @param email 邮箱
     * @return 脱敏后的邮箱
     */
    public static String maskEmail(String email) {
        if (isBlank(email)) {
            return email;
        }
        int index = email.indexOf('@');
        if (index <= 1) {
            return email;
        }
        return mask(email, 1, email.length() - index, '*');
    }

    /**
     * 身份证号脱敏
     *
     * @param idCard 身份证号
     * @return 脱敏后的身份证号
     */
    public static String maskIdCard(String idCard) {
        if (isBlank(idCard)) {
            return idCard;
        }
        return mask(idCard, 6, 4, '*');
    }
}