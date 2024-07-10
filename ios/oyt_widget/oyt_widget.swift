import WidgetKit
import SwiftUI
import Intents

func retrieveDaysSince() -> String {
    let userDefaults = UserDefaults(suiteName: "group.one_year_together")
    
    // App Group에서 불러온 데이터를 로그로 출력
    if let daysSince = userDefaults?.string(forKey: "daysSince") {
        print("Retrieved days since: \(daysSince)") // 불러온 숫자 출력
        return "\(daysSince) days since target date"
    } else {
        print("Failed to retrieve days since from UserDefaults")
    }
    
    return "0 days since target date" // 기본값 설정
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), daysSince: "0 days since target date")
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), daysSince: "0 days since target date")
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
        var entries: [SimpleEntry] = []

        let currentDate = Date()
        for hourOffset in 0 ..< 5 {
            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
            let daysSince = retrieveDaysSince()
            let entry = SimpleEntry(date: entryDate, daysSince: daysSince)
            entries.append(entry)
        }

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let daysSince: String
}

struct oyt_widgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        ZStack {
            Text(entry.daysSince)
                .font(.largeTitle)
                .padding()
        }
        .containerBackground(Color.red, for: .widget) // 배경색 설정
    }
}

struct oyt_widget: Widget {
    let kind: String = "oyt_widget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            oyt_widgetEntryView(entry: entry)
        }
        .configurationDisplayName("Days Since Widget")
        .description("This is a widget to display the number of days since the target date.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge]) // 지원하는 위젯 크기 설정
    }
}
