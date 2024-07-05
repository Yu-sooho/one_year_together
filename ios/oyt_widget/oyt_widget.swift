import WidgetKit
import SwiftUI
import Intents

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), dDay: "D-100")
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), dDay: "D-100")
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
        var entries: [SimpleEntry] = []

        let currentDate = Date()
        for hourOffset in 0 ..< 5 {
            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
            let dDay = calculateDDay()
            let entry = SimpleEntry(date: entryDate, dDay: dDay)
            entries.append(entry)
        }

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let dDay: String
}

struct oyt_widgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        Text(entry.dDay)
            .font(.largeTitle)
    }
}

struct oyt_widget: Widget {
    let kind: String = "oyt_widget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            oyt_widgetEntryView(entry: entry)
        }
        .configurationDisplayName("D-day Widget")
        .description("This is a widget to display D-day.")
    }
}

func calculateDDay() -> String {
    let userDefaults = UserDefaults(suiteName: "group.one_year_together")
    let targetDate = userDefaults?.object(forKey: "targetDate") as? Date ?? Date()
    let currentDate = Date()
    let components = Calendar.current.dateComponents([.day], from: currentDate, to: targetDate)
    return "D-\(components.day ?? 0)"
}
