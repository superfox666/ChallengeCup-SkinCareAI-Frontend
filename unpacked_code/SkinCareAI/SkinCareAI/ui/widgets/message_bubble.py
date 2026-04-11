# 顶部导入
import markdown2

def format_message(self):
    # 使用专业库转换 Markdown 到 HTML
    return markdown2.markdown(self.message, extras=["fenced-code-blocks"])
from PyQt5.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QTextBrowser
from PyQt5.QtCore import Qt, QSize
from PyQt5.QtGui import QFont, QPalette, QColor


class MessageBubble(QWidget):
    """消息气泡控件"""

    def __init__(self, message, is_user=True, timestamp=None, parent=None):
        super().__init__(parent)
        self.message = message
        self.is_user = is_user
        self.timestamp = timestamp

        self.init_ui()

    def init_ui(self):
        """初始化界面"""
        # 主布局
        main_layout = QHBoxLayout(self)
        main_layout.setContentsMargins(20, 5, 20, 5)

        # 根据消息类型设置对齐方式
        if self.is_user:
            main_layout.addStretch()
            bubble_layout = QVBoxLayout()
            bubble_layout.setAlignment(Qt.AlignRight)
        else:
            bubble_layout = QVBoxLayout()
            bubble_layout.setAlignment(Qt.AlignLeft)
            main_layout.addLayout(bubble_layout)
            main_layout.addStretch()

        # 消息内容
        self.content_label = QTextBrowser()
        self.content_label.setMaximumWidth(600)
        self.content_label.setMinimumHeight(50)
        self.content_label.setReadOnly(True)

        # 设置样式
        if self.is_user:
            # 用户消息 - 蓝色气泡
            bubble_style = """
                QTextBrowser {
                    background-color: #1E90FF;
                    color: white;
                    border-radius: 18px;
                    padding: 12px 16px;
                    border: none;
                    font-size: 14px;
                    line-height: 1.5;
                }
            """
        else:
            # AI消息 - 灰色气泡
            bubble_style = """
                QTextBrowser {
                    background-color: #F0F0F0;
                    color: #333333;
                    border-radius: 18px;
                    padding: 12px 16px;
                    border: none;
                    font-size: 14px;
                    line-height: 1.5;
                }
            """

        self.content_label.setStyleSheet(bubble_style)

        # 设置消息内容（支持HTML）
        self.content_label.setHtml(self.format_message())

        bubble_layout.addWidget(self.content_label)

        # 时间戳
        if self.timestamp:
            time_label = QLabel(self.timestamp)
            time_label.setStyleSheet("""
                QLabel {
                    color: #999999;
                    font-size: 11px;
                    padding: 2px 10px;
                }
            """)

            if self.is_user:
                time_label.setAlignment(Qt.AlignRight)
            else:
                time_label.setAlignment(Qt.AlignLeft)

            bubble_layout.addWidget(time_label)


    def format_message(self):
        # 使用专业库转换 Markdown 到 HTML
        return markdown2.markdown(self.message, extras=["fenced-code-blocks"])



    def sizeHint(self):
        # 动态计算最大宽度，例如父容器宽度的 70%
        max_width = self.parent().width() * 0.7 if self.parent() else 600
        return QSize(max_width, self.content_label.sizeHint().height() + 40)