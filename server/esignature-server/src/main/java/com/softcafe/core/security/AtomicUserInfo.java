package com.softcafe.core.security;

import java.util.Date;
import java.util.concurrent.atomic.AtomicReference;

public class AtomicUserInfo {

    private final AtomicReference<DateCountPair> atomicPair;

    public AtomicUserInfo(Date initialDate, int initialCount) {
        this.atomicPair = new AtomicReference<>(new DateCountPair(initialDate, initialCount));
    }

    private static class DateCountPair {
        private final Date date;
        private final int count;

        public DateCountPair(Date date, int count) {
            this.date = date;
            this.count = count;
        }

        public Date getDate() {
            return date;
        }

        public int getCount() {
            return count;
        }
    }


    public Date getDate() {
        return atomicPair.get().getDate();
    }

    public int getCount() {
        return atomicPair.get().getCount();
    }

    public void set(Date newDate, int newCount) {
        atomicPair.set(new DateCountPair(newDate, newCount));
    }

    public void incrementCount() {
        atomicPair.updateAndGet(pair -> new DateCountPair(new Date(), pair.getCount() + 1));
    }

}
