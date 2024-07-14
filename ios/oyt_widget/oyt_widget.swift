import WidgetKit
import SwiftUI
import Intents

func retrieveDaysSince() -> String {
    let userDefaults = UserDefaults(suiteName: "group.one_year_together")
    
    if let startDate = userDefaults?.string(forKey: "startDate") {
      if let jsTimestamp = Double(startDate) {
          let jsTimeInterval = jsTimestamp / 1000

          let currentDate = Date()

          let jsDate = Date(timeIntervalSince1970: jsTimeInterval)

          let timeDifference = currentDate.timeIntervalSince(jsDate)

          let seconds = Int(timeDifference) % 60
          let minutes = (Int(timeDifference) / 60) % 60
          let hours = (Int(timeDifference) / 3600) % 24
          let days = Int(timeDifference) / 86400

        return "\(days)"
      } else {
          print("잘못된 타임스탬프 문자열입니다.")
        return "Error TimeStamp"
      }
      
    } else {
      return "Error TimeStamp"
    }
    
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
            .font(.caption)
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
