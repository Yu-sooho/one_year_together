import WidgetKit
import SwiftUI
import Intents
import Combine

struct RemoteImageView: View {
    let urlString: String
    
    var body: some View {
        // URL로부터 이미지를 비동기적으로 로드
        AsyncImage(url: URL(string: urlString)) { image in
            image
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height)
                .clipped()
        } placeholder: {
            ProgressView() // 이미지를 로드하는 동안 표시할 로딩 스피너
        }
    }
}

func retrieveDaysSince(time:String) -> String {
    
      if let jsTimestamp = Double(time) {
          let jsTimeInterval = jsTimestamp / 1000

          let currentDate = Date()

          let jsDate = Date(timeIntervalSince1970: jsTimeInterval)

          let timeDifference = currentDate.timeIntervalSince(jsDate)

          let _seconds = Int(timeDifference) % 60
          let _minutes = (Int(timeDifference) / 60) % 60
          let _hours = (Int(timeDifference) / 3600) % 24
          let _days = Int(timeDifference) / 86400

        return "\(_days)"
      } else {
          print("잘못된 타임스탬프 문자열입니다.")
        return "Error TimeStamp"
      }
      
    
}


struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
      SimpleEntry(
        date: Date(),
        startDaysSince: "0 days since target date",
        firstDaysSince: "0 days since target date",
        MarryDaysSince: "0 days since target date",
        savedImageUrl:"")
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = 
          SimpleEntry(
            date: Date(),
            startDaysSince: "0 days since target date",
            firstDaysSince: "0 days since target date",
            MarryDaysSince: "0 days since target date",
            savedImageUrl:"")
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
        var entries: [SimpleEntry] = []

        let currentDate = Date()
        for hourOffset in 0 ..< 5 {
            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
            let userDefaults = UserDefaults(suiteName: "group.one_year_together")
          
            var startDaysSince: String = ""
            var firstDaysSince: String = ""
            var marryDaysSince: String = ""
            var savedImageUrl: String = ""
          
            if let startDate = userDefaults?.string(forKey: "startDate") {
              startDaysSince = retrieveDaysSince(time:startDate)
            }
            if let firstDate = userDefaults?.string(forKey: "firstDate") {
              firstDaysSince = retrieveDaysSince(time:firstDate)
            }
          if let marryDate = userDefaults?.string(forKey: "marryDate") {
            marryDaysSince = retrieveDaysSince(time:marryDate)
          }
          if let getImageUrl = userDefaults?.string(forKey: "imageUrl") {
            savedImageUrl = getImageUrl
          }
          
          let entry = SimpleEntry(date: entryDate, startDaysSince: startDaysSince, firstDaysSince: firstDaysSince, MarryDaysSince: marryDaysSince, savedImageUrl:savedImageUrl)
            entries.append(entry)
        }

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let startDaysSince: String
    let firstDaysSince: String
    let MarryDaysSince: String
    let savedImageUrl:String
}

struct oyt_widgetEntryView : View {
    var entry: Provider.Entry
    
    var body: some View {
        ZStack {
            let imageUrl = entry.savedImageUrl
            
            // URL로부터 이미지를 비동기적으로 로드
            AsyncImage(url: URL(string: imageUrl)) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .clipped()
            } placeholder: {
                Color.blue // 이미지를 로드하는 동안 표시할 기본 배경색
            }
            
            // 텍스트 오버레이
            VStack {
                Text(entry.firstDaysSince)
                    .padding(4)
                
                Text(entry.startDaysSince)
                    .padding(4)
                
                Text(entry.MarryDaysSince)
                    .padding(4)
                
                Text(entry.MarryDaysSince)
                    .padding(4)
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
        }
        .containerBackground(Color.clear, for: .widget) // 배경색을 투명으로 설정
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
