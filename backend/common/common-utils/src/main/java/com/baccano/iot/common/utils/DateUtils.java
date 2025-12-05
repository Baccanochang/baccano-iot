package com.baccano.iot.common.utils;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.Date;

/**
 * 日期时间工具类
 *
 * @author baccano-iot
 */
public class DateUtils {
    /**
     * 日期格式：yyyy-MM-dd
     */
    public static final String DATE_FORMAT = "yyyy-MM-dd";

    /**
     * 时间格式：HH:mm:ss
     */
    public static final String TIME_FORMAT = "HH:mm:ss";

    /**
     * 日期时间格式：yyyy-MM-dd HH:mm:ss
     */
    public static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    /**
     * 日期时间格式：yyyy-MM-dd HH:mm:ss.SSS
     */
    public static final String DATETIME_FORMAT_WITH_MS = "yyyy-MM-dd HH:mm:ss.SSS";

    /**
     * 日期时间格式：yyyyMMddHHmmss
     */
    public static final String DATETIME_FORMAT_NO_SEPARATOR = "yyyyMMddHHmmss";

    /**
     * 默认时区
     */
    public static final ZoneId DEFAULT_ZONE_ID = ZoneId.systemDefault();

    /**
     * 获取当前日期
     *
     * @return 当前日期
     */
    public static LocalDate nowDate() {
        return LocalDate.now(DEFAULT_ZONE_ID);
    }

    /**
     * 获取当前时间
     *
     * @return 当前时间
     */
    public static LocalTime nowTime() {
        return LocalTime.now(DEFAULT_ZONE_ID);
    }

    /**
     * 获取当前日期时间
     *
     * @return 当前日期时间
     */
    public static LocalDateTime nowDateTime() {
        return LocalDateTime.now(DEFAULT_ZONE_ID);
    }

    /**
     * 格式化日期
     *
     * @param date    日期
     * @param pattern 格式
     * @return 格式化后的日期字符串
     */
    public static String format(LocalDate date, String pattern) {
        if (date == null) {
            return null;
        }
        return date.format(DateTimeFormatter.ofPattern(pattern));
    }

    /**
     * 格式化日期
     *
     * @param date 日期
     * @return 格式化后的日期字符串，格式：yyyy-MM-dd
     */
    public static String format(LocalDate date) {
        return format(date, DATE_FORMAT);
    }

    /**
     * 格式化时间
     *
     * @param time    时间
     * @param pattern 格式
     * @return 格式化后的时间字符串
     */
    public static String format(LocalTime time, String pattern) {
        if (time == null) {
            return null;
        }
        return time.format(DateTimeFormatter.ofPattern(pattern));
    }

    /**
     * 格式化时间
     *
     * @param time 时间
     * @return 格式化后的时间字符串，格式：HH:mm:ss
     */
    public static String format(LocalTime time) {
        return format(time, TIME_FORMAT);
    }

    /**
     * 格式化日期时间
     *
     * @param dateTime 日期时间
     * @param pattern  格式
     * @return 格式化后的日期时间字符串
     */
    public static String format(LocalDateTime dateTime, String pattern) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DateTimeFormatter.ofPattern(pattern));
    }

    /**
     * 格式化日期时间
     *
     * @param dateTime 日期时间
     * @return 格式化后的日期时间字符串，格式：yyyy-MM-dd HH:mm:ss
     */
    public static String format(LocalDateTime dateTime) {
        return format(dateTime, DATETIME_FORMAT);
    }

    /**
     * 格式化日期时间
     *
     * @param dateTime 日期时间
     * @return 格式化后的日期时间字符串，格式：yyyy-MM-dd HH:mm:ss.SSS
     */
    public static String formatWithMs(LocalDateTime dateTime) {
        return format(dateTime, DATETIME_FORMAT_WITH_MS);
    }

    /**
     * 解析日期字符串
     *
     * @param dateStr  日期字符串
     * @param pattern  格式
     * @return 解析后的日期
     */
    public static LocalDate parseDate(String dateStr, String pattern) {
        if (StringUtils.isBlank(dateStr)) {
            return null;
        }
        return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern(pattern));
    }

    /**
     * 解析日期字符串
     *
     * @param dateStr 日期字符串，格式：yyyy-MM-dd
     * @return 解析后的日期
     */
    public static LocalDate parseDate(String dateStr) {
        return parseDate(dateStr, DATE_FORMAT);
    }

    /**
     * 解析时间字符串
     *
     * @param timeStr 时间字符串
     * @param pattern 格式
     * @return 解析后的时间
     */
    public static LocalTime parseTime(String timeStr, String pattern) {
        if (StringUtils.isBlank(timeStr)) {
            return null;
        }
        return LocalTime.parse(timeStr, DateTimeFormatter.ofPattern(pattern));
    }

    /**
     * 解析时间字符串
     *
     * @param timeStr 时间字符串，格式：HH:mm:ss
     * @return 解析后的时间
     */
    public static LocalTime parseTime(String timeStr) {
        return parseTime(timeStr, TIME_FORMAT);
    }

    /**
     * 解析日期时间字符串
     *
     * @param dateTimeStr 日期时间字符串
     * @param pattern     格式
     * @return 解析后的日期时间
     */
    public static LocalDateTime parseDateTime(String dateTimeStr, String pattern) {
        if (StringUtils.isBlank(dateTimeStr)) {
            return null;
        }
        return LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ofPattern(pattern));
    }

    /**
     * 解析日期时间字符串
     *
     * @param dateTimeStr 日期时间字符串，格式：yyyy-MM-dd HH:mm:ss
     * @return 解析后的日期时间
     */
    public static LocalDateTime parseDateTime(String dateTimeStr) {
        return parseDateTime(dateTimeStr, DATETIME_FORMAT);
    }

    /**
     * Date 转 LocalDateTime
     *
     * @param date Date对象
     * @return LocalDateTime对象
     */
    public static LocalDateTime dateToLocalDateTime(Date date) {
        if (date == null) {
            return null;
        }
        return date.toInstant().atZone(DEFAULT_ZONE_ID).toLocalDateTime();
    }

    /**
     * LocalDateTime 转 Date
     *
     * @param localDateTime LocalDateTime对象
     * @return Date对象
     */
    public static Date localDateTimeToDate(LocalDateTime localDateTime) {
        if (localDateTime == null) {
            return null;
        }
        return Date.from(localDateTime.atZone(DEFAULT_ZONE_ID).toInstant());
    }

    /**
     * 获取本月第一天
     *
     * @return 本月第一天
     */
    public static LocalDate firstDayOfMonth() {
        return nowDate().with(TemporalAdjusters.firstDayOfMonth());
    }

    /**
     * 获取本月最后一天
     *
     * @return 本月最后一天
     */
    public static LocalDate lastDayOfMonth() {
        return nowDate().with(TemporalAdjusters.lastDayOfMonth());
    }

    /**
     * 获取本周第一天（周一）
     *
     * @return 本周第一天
     */
    public static LocalDate firstDayOfWeek() {
        return nowDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    }

    /**
     * 获取本周最后一天（周日）
     *
     * @return 本周最后一天
     */
    public static LocalDate lastDayOfWeek() {
        return nowDate().with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
    }
}