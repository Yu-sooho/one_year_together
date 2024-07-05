package com.one_year_together;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class WidgetUpdateService extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_layout);

            // D-day 계산 및 업데이트할 데이터 설정
            String dDayText = calculateDDay(context);
            views.setTextViewText(R.id.widget_text, "D-day: " + dDayText);
            views.setTextViewText(R.id.widget_days_left, "Days Left: " + dDayText);

            // 클릭 이벤트 설정
            Intent intent = new Intent(context, MainActivity.class);
            PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
            views.setOnClickPendingIntent(R.id.widget_text, pendingIntent);
            views.setOnClickPendingIntent(R.id.widget_days_left, pendingIntent);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }

    private String calculateDDay(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("your_shared_prefs", Context.MODE_PRIVATE);
        String targetDateStr = prefs.getString("targetDate", "");
        if (!targetDateStr.isEmpty()) {
            try {
                Date targetDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).parse(targetDateStr);
                long targetTime = targetDate.getTime();
                long currentTime = System.currentTimeMillis();
                long diffTime = targetTime - currentTime;
                long diffDays = diffTime / (24 * 60 * 60 * 1000L);
                return String.valueOf(diffDays);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        return "100"; // 기본값
    }
}
