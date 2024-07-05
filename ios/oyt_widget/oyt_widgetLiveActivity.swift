import WidgetKit
import SwiftUI
import ActivityKit

struct oyt_widgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: oyt_widgetAttributes.self) { context in
            VStack {
                Text("Live Activity")
                Text(context.state.someState)
            }
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom")
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T")
            } minimal: {
                Text("M")
            }
        }
    }
}

struct oyt_widgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var someState: String
    }
}
