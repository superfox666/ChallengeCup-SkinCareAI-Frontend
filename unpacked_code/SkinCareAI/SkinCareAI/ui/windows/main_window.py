# 补充缺失的核心导入
from PyQt5.QtCore import QThread, pyqtSignal, Qt, QObject
from PyQt5.QtWidgets import (QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
                             QSplitter, QListWidget, QTextEdit, QPushButton,
                             QApplication, QLabel, QFrame, QStackedWidget,
                             QScrollArea, QSizePolicy)
from PyQt5.QtGui import QFont, QIcon, QPixmap
import sys
import os
from datetime import datetime  # 提前导入，避免重复导入消耗性能

# 导入自定义模块（确保路径正确）
sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
from utils.rag_client import RAGClient
from ui.windows.knowledge_window import KnowledgeWindow

class MainWindow(QMainWindow):
    # 在MainWindow类中添加：
    from ui.widgets.message_bubble import MessageBubble
    from PyQt5.QtWidgets import QScrollArea, QVBoxLayout, QWidget
    from ui.windows.knowledge_window import KnowledgeWindow
    """主窗口 - 类似QQ/微信布局"""

    def __init__(self):
        super().__init__()
        # 1. 初始化核心变量（关键：加初始化完成标识）
        self.rag_client = RAGClient(use_rag=True)
        self.ai_initialized = False  # AI初始化完成标识
        self.thinking_msg_flag = False  # 标记是否显示“正在思考”

        # 2. 启动AI初始化线程（修复线程赋值错误）
        self.init_worker = InitAIWorker(self.rag_client)
        self.init_worker.init_success.connect(self.on_ai_init_success)
        self.init_worker.init_failed.connect(self.on_ai_init_failed)
        self.init_worker.start()

        # 3. 初始化UI和信号连接
        self.init_ui()
        self.setup_connections()

    def on_ai_init_success(self):
        """AI初始化成功回调"""
        self.ai_initialized = True
        self.statusBar().showMessage("✅ AI助手初始化完成，可开始提问")

    def on_ai_init_failed(self, error_msg):
        """AI初始化失败回调"""
        self.ai_initialized = False
        self.statusBar().showMessage(f"❌ AI初始化失败：{error_msg}")

    def create_sidebar(self):
        """创建左侧侧边栏"""
        sidebar = QFrame()
        sidebar.setObjectName("sidebar")
        sidebar.setStyleSheet("""
            QFrame#sidebar {
                background-color: #2E2E2E;
                border-right: 1px solid #1E1E1E;
            }
        """)

        layout = QVBoxLayout(sidebar)
        layout.setContentsMargins(0, 20, 0, 20)
        layout.setSpacing(10)

        # 应用标题
        title_label = QLabel("皮肤AI助手")
        title_label.setAlignment(Qt.AlignCenter)
        title_label.setStyleSheet("""
            QLabel {
                color: #FFFFFF;
                font-size: 18px;
                font-weight: bold;
                padding: 10px;
                border-bottom: 1px solid #404040;
            }
        """)
        layout.addWidget(title_label)

        # 功能列表
        self.function_list = QListWidget()
        self.function_list.setObjectName("functionList")
        self.function_list.setStyleSheet("""
            QListWidget#functionList {
                background-color: transparent;
                border: none;
                color: #CCCCCC;
                font-size: 14px;
            }
            QListWidget#functionList::item {
                padding: 12px 20px;
                border-left: 4px solid transparent;
            }
            QListWidget#functionList::item:selected {
                background-color: #404040;
                border-left: 4px solid #1E90FF;
                color: #FFFFFF;
            }
            QListWidget#functionList::item:hover {
                background-color: #353535;
            }
        """)

        # 添加功能项
        functions = [
            "💬 智能问答",
            "📚 知识库管理",
            "💊 产品展示",
            "📊 数据分析",
            "⚙️ 系统设置",
            "o_O 拍照分析",
            "O_o 视频分析"
        ]
        self.function_list.addItems(functions)
        self.function_list.setCurrentRow(0)  # 默认选中第一个

        layout.addWidget(self.function_list)
        layout.addStretch()

        return sidebar

    def create_main_area(self):
        main_area = QWidget()
        layout = QVBoxLayout(main_area)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        self.stacked_widget = QStackedWidget()
        # 补全7个功能页面（与侧边栏列表一一对应）
        self.chat_page = self.create_chat_page()
        self.knowledge_page = KnowledgeWindow()
        self.product_page = self.create_product_page()
        self.analysis_page = self.create_analysis_page()  # 数据分析
        self.settings_page = self.create_settings_page()  # 系统设置
        self.camera_analysis_page = self.create_camera_analysis_page()  # 拍照分析
        self.video_analysis_page = self.create_video_analysis_page()  # 视频分析

        # 按侧边栏顺序添加
        self.stacked_widget.addWidget(self.chat_page)
        self.stacked_widget.addWidget(self.knowledge_page)
        self.stacked_widget.addWidget(self.product_page)
        self.stacked_widget.addWidget(self.analysis_page)
        self.stacked_widget.addWidget(self.settings_page)
        self.stacked_widget.addWidget(self.camera_analysis_page)
        self.stacked_widget.addWidget(self.video_analysis_page)

        layout.addWidget(self.stacked_widget)
        return main_area

    # 新增占位页面方法
    def create_analysis_page(self):
        page = QWidget()
        layout = QVBoxLayout(page)
        label = QLabel("📊 数据分析页面（待实现）")
        label.setAlignment(Qt.AlignCenter)
        label.setStyleSheet("font-size: 18px; color: #666;")
        layout.addWidget(label)
        return page

    def create_settings_page(self):
        page = QWidget()
        layout = QVBoxLayout(page)
        label = QLabel("⚙️ 系统设置页面（待实现）")
        label.setAlignment(Qt.AlignCenter)
        label.setStyleSheet("font-size: 18px; color: #666;")
        layout.addWidget(label)
        return page

    def create_camera_analysis_page(self):
        page = QWidget()
        layout = QVBoxLayout(page)
        label = QLabel("📷 拍照分析页面（待实现）")
        label.setAlignment(Qt.AlignCenter)
        label.setStyleSheet("font-size: 18px; color: #666;")
        layout.addWidget(label)
        return page

    def create_video_analysis_page(self):
        page = QWidget()
        layout = QVBoxLayout(page)
        label = QLabel("🎬 视频分析页面（待实现）")
        label.setAlignment(Qt.AlignCenter)
        label.setStyleSheet("font-size: 18px; color: #666;")
        layout.addWidget(label)
        return page
    def create_chat_page(self):
        """创建聊天页面"""
        page = QWidget()
        layout = QVBoxLayout(page)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        # 聊天区域标题栏
        title_bar = QFrame()
        title_bar.setObjectName("chatTitleBar")
        title_bar.setStyleSheet("""
               QFrame#chatTitleBar {
                   background-color: #F8F8F8;
                   border-bottom: 1px solid #E0E0E0;
                   padding: 12px 20px;
               }
           """)

        title_layout = QHBoxLayout(title_bar)
        title_layout.setContentsMargins(0, 0, 0, 0)

        title_label = QLabel("💬 皮肤疾病智能问答")
        title_label.setStyleSheet("""
               QLabel {
                   color: #333333;
                   font-size: 16px;
                   font-weight: bold;
               }
           """)

        title_layout.addWidget(title_label)
        title_layout.addStretch()

        layout.addWidget(title_bar)
        # 创建可滚动的聊天区域
        scroll_area = QScrollArea()
        scroll_area.setWidgetResizable(True)
        scroll_area.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        scroll_area.setStyleSheet("""
                QScrollArea {
                    border: none;
                    background-color: #FFFFFF;
                }
                QScrollBar:vertical {
                    border: none;
                    background: #F0F0F0;
                    width: 8px;
                    margin: 0px;
                }
                QScrollBar::handle:vertical {
                    background: #C0C0C0;
                    min-height: 20px;
                    border-radius: 4px;
                }
                QScrollBar::handle:vertical:hover {
                    background: #A0A0A0;
                }
            """)

        # 聊天内容容器
        self.chat_container = QWidget()
        self.chat_layout = QVBoxLayout(self.chat_container)
        self.chat_layout.setAlignment(Qt.AlignTop)
        self.chat_layout.setContentsMargins(20, 20, 20, 20)
        self.chat_layout.setSpacing(10)

        scroll_area.setWidget(self.chat_container)
        layout.addWidget(scroll_area)
        # 聊天消息区域
        self.chat_display = QTextEdit()
        self.chat_display.setObjectName("chatDisplay")
        self.chat_display.setReadOnly(True)
        self.chat_display.setStyleSheet("""
                   QTextEdit#chatDisplay {
                       background-color: #FFFFFF;
                       border: none;
                       font-size: 14px;
                       padding: 20px;
                   }
               """)
        layout.addWidget(self.chat_display)
        # 输入区域
        input_area = self.create_input_area()
        layout.addWidget(input_area)

        return page

    # 修改消息显示方法：
    # 修改消息显示方法：
    def display_user_message(self, message):
        """显示用户消息"""
        from datetime import datetime
        timestamp = datetime.now().strftime("%H:%M")

        bubble = MessageBubble(message, is_user=True, timestamp=timestamp)
        self.chat_layout.addWidget(bubble)

        # 滚动到底部
        self.scroll_to_bottom()

    def display_ai_message(self, message):
        """显示AI消息"""
        from datetime import datetime
        timestamp = datetime.now().strftime("%H:%M")

        bubble = MessageBubble(message, is_user=False, timestamp=timestamp)
        self.chat_layout.addWidget(bubble)

        # 滚动到底部
        self.scroll_to_bottom()

    def scroll_to_bottom(self):
        """滚动到底部"""
        # 通过查找父级QScrollArea来实现滚动
        scroll_area = self.chat_container.parent().parent()
        if isinstance(scroll_area, QScrollArea):
            scroll_bar = scroll_area.verticalScrollBar()
            scroll_bar.setValue(scroll_bar.maximum())
    # 修改消息显示方法：
    def display_user_message(self, message):
        """显示用户消息"""
        from datetime import datetime
        timestamp = datetime.now().strftime("%H:%M")

        bubble = MessageBubble(message, is_user=True, timestamp=timestamp)
        self.chat_layout.addWidget(bubble)

        # 滚动到底部
        self.scroll_to_bottom()

    def display_ai_message(self, message):
        """显示AI消息"""
        from datetime import datetime
        timestamp = datetime.now().strftime("%H:%M")

        bubble = MessageBubble(message, is_user=False, timestamp=timestamp)
        self.chat_layout.addWidget(bubble)

        # 滚动到底部
        self.scroll_to_bottom()

    def scroll_to_bottom(self):
        """滚动到底部"""
        # 通过查找父级QScrollArea来实现滚动
        scroll_area = self.chat_container.parent().parent()
        if isinstance(scroll_area, QScrollArea):
            scroll_bar = scroll_area.verticalScrollBar()
            scroll_bar.setValue(scroll_bar.maximum())

        # 聊天区域标题栏
        title_bar = QFrame()
        title_bar.setObjectName("chatTitleBar")
        title_bar.setStyleSheet("""
            QFrame#chatTitleBar {
                background-color: #F8F8F8;
                border-bottom: 1px solid #E0E0E0;
                padding: 12px 20px;
            }
        """)

        title_layout = QHBoxLayout(title_bar)
        title_layout.setContentsMargins(0, 0, 0, 0)

        title_label = QLabel("💬 皮肤疾病智能问答")
        title_label.setStyleSheet("""
            QLabel {
                color: #333333;
                font-size: 16px;
                font-weight: bold;
            }
        """)

        title_layout.addWidget(title_label)
        title_layout.addStretch()

        layout.addWidget(title_bar)

        # 聊天消息区域
        self.chat_display = QTextEdit()
        self.chat_display.setObjectName("chatDisplay")
        self.chat_display.setReadOnly(True)
        self.chat_display.setStyleSheet("""
            QTextEdit#chatDisplay {
                background-color: #FFFFFF;
                border: none;
                font-size: 14px;
                padding: 20px;
            }
        """)
        layout.addWidget(self.chat_display)

        # 输入区域
        input_area = self.create_input_area()
        layout.addWidget(input_area)

        return page

    def create_input_area(self):
        """创建输入区域"""
        input_frame = QFrame()
        input_frame.setObjectName("inputFrame")
        input_frame.setStyleSheet("""
            QFrame#inputFrame {
                background-color: #F8F8F8;
                border-top: 1px solid #E0E0E0;
                padding: 15px;
            }
        """)

        layout = QVBoxLayout(input_frame)
        layout.setContentsMargins(0, 0, 0, 0)

        # 输入框
        self.input_text = QTextEdit()
        self.input_text.setObjectName("inputText")
        self.input_text.setMaximumHeight(100)
        self.input_text.setPlaceholderText("请输入您的皮肤问题...")
        self.input_text.setStyleSheet("""
            QTextEdit#inputText {
                background-color: #FFFFFF;
                border: 1px solid #D0D0D0;
                border-radius: 8px;
                padding: 12px;
                font-size: 14px;
            }
            QTextEdit#inputText:focus {
                border: 1px solid #1E90FF;
            }
        """)
        layout.addWidget(self.input_text)

        # 按钮区域
        button_layout = QHBoxLayout()

        # 功能按钮
        self.btn_attach = QPushButton("📎 附件")
        self.btn_voice = QPushButton("🎤 语音")
        self.btn_clear = QPushButton("🗑️ 清空")

        for btn in [self.btn_attach, self.btn_voice, self.btn_clear]:
            btn.setStyleSheet("""
                QPushButton {
                    background-color: transparent;
                    color: #666666;
                    border: 1px solid #D0D0D0;
                    border-radius: 4px;
                    padding: 8px 16px;
                    font-size: 13px;
                }
                QPushButton:hover {
                    background-color: #F0F0F0;
                }
            """)
            button_layout.addWidget(btn)

        button_layout.addStretch()

        # 发送按钮
        self.btn_send = QPushButton("发送 (Ctrl+Enter)")
        self.btn_send.setStyleSheet("""
            QPushButton {
                background-color: #1E90FF;
                color: white;
                border: none;
                border-radius: 6px;
                padding: 10px 24px;
                font-size: 14px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #1C86EE;
            }
            QPushButton:pressed {
                background-color: #1874CD;
            }
        """)
        button_layout.addWidget(self.btn_send)

        layout.addLayout(button_layout)

        return input_frame

    def create_knowledge_page(self):
        """创建知识库管理页面"""
        page = QWidget()
        layout = QVBoxLayout(page)

        label = QLabel("📚 知识库管理页面（待实现）")
        label.setAlignment(Qt.AlignCenter)
        label.setStyleSheet("font-size: 18px; color: #666;")

        layout.addWidget(label)

        return page

    def create_product_page(self):
        """创建产品展示页面"""
        page = QWidget()
        layout = QVBoxLayout(page)

        label = QLabel("💊 公司产品展示页面（待实现）")
        label.setAlignment(Qt.AlignCenter)
        label.setStyleSheet("font-size: 18px; color: #666;")

        layout.addWidget(label)

        return page

    def setup_connections(self):
        """设置信号槽连接"""
        # 侧边栏功能切换
        self.function_list.currentRowChanged.connect(self.switch_page)

        # 发送按钮
        self.btn_send.clicked.connect(self.send_message)

        # 清空按钮
        self.btn_clear.clicked.connect(self.clear_input)

    def switch_page(self, index):
        """切换功能页面"""
        self.stacked_widget.setCurrentIndex(index)

    def send_message(self):
        """发送消息"""
        message = self.input_text.toPlainText().strip()
        if not message:
            return

        # 显示用户消息
        self.display_user_message(message)

        # 清空输入框
        self.input_text.clear()

        # TODO: 调用AI处理
        self.display_ai_message("正在思考中...")

    def display_user_message(self, message):
        """显示用户消息（右侧气泡）"""
        html = f"""
        <div style="margin: 10px 0; text-align: right;">
            <div style="display: inline-block; max-width: 70%;">
                <div style="background-color: #1E90FF; color: white; 
                          padding: 10px 15px; border-radius: 18px 18px 0 18px;
                          font-size: 14px; line-height: 1.5;">
                    {message}
                </div>
                <div style="font-size: 12px; color: #999; padding: 5px 10px;">
                    {self.get_current_time()}
                </div>
            </div>
        </div>
        """
        self.append_to_chat(html)

    def send_message(self):
        message = self.input_text.toPlainText().strip()
        if not message or not self.ai_initialized:
            if not self.ai_initialized:
                self.statusBar().showMessage("❌ AI尚未初始化完成，请稍候")
            return

        # 显示用户消息
        self.display_user_message(message)
        self.input_text.clear()
        # 禁用发送按钮（修复重复发送）
        self.btn_send.setEnabled(False)

        # 显示“正在思考”消息（加唯一标识）
        thinking_html = f"""
        <div id="thinking_msg">
            <div style="margin: 10px 0;">
                <div style="display: inline-block; max-width: 70%;">
                    <div style="background-color: #F0F0F0; color: #333; padding: 10px 15px; border-radius: 18px 18px 18px 0; font-size: 14px; line-height: 1.5;">
                        ⏳ 正在分析您的问题，请稍候...
                    </div>
                    <div style="font-size: 12px; color: #999; padding: 5px 10px;">
                        {self.get_current_time()}
                    </div>
                </div>
            </div>
        </div>
        <!--thinking_end-->
        """
        self.append_to_chat(thinking_html)
        self.thinking_msg_flag = True

        # 启动AI工作线程
        self.ai_worker = AIWorker(self.rag_client, message)
        self.ai_worker.response_received.connect(self.handle_ai_response)
        self.ai_worker.error_occurred.connect(self.handle_ai_error)
        self.ai_worker.start()

    def append_to_chat(self, html):
        """向聊天区域添加内容（修复分隔线不显示问题）"""
        cursor = self.chat_display.textCursor()
        cursor.movePosition(cursor.End)

        # 关键：用HTML判断是否有历史消息，而非纯文本
        current_html = self.chat_display.toHtml()
        if current_html and "<!--thinking_msg-->" not in current_html and len(current_html) > 100:
            # 非首次消息、非思考消息，添加分隔线
            cursor.insertHtml('<hr style="border: none; border-top: 1px solid #E0E0E0; margin: 10px 0;">')

        cursor.insertHtml(html)
        self.chat_display.setTextCursor(cursor)
        self.chat_display.ensureCursorVisible()

    def clear_input(self):
        """清空输入框"""
        self.input_text.clear()

    def get_current_time(self):
        """获取当前时间"""
        from datetime import datetime
        return datetime.now().strftime("%H:%M")

    # 在MainWindow类的__init__方法中添加：
    class MainWindow(QMainWindow):
        def __init__(self):
            super().__init__()
            # 初始化RAG客户端
            self.rag_client = RAGClient(use_rag=True)

            # 在单独的线程中初始化AI
            self.init_worker = QThread()
            self.init_worker.run = self.rag_client.initialize
            self.init_worker.start()

            self.init_ui()
            self.setup_connections()

        # 修改send_message方法：
        # 修改send_message方法：
        def send_message(self):
            """发送消息"""
            message = self.input_text.toPlainText().strip()
            if not message:
                return

            # 显示用户消息
            self.display_user_message(message)

            # 清空输入框
            self.input_text.clear()

            # 显示"正在思考"消息
            self.display_ai_message("🤔 正在分析您的问题，请稍候...")

            # 创建并启动AI工作线程
            self.ai_worker = AIWorker(self.rag_client, message)
            self.ai_worker.response_received.connect(self.handle_ai_response)
            self.ai_worker.error_occurred.connect(self.handle_ai_error)
            self.ai_worker.start()

        def handle_ai_response(self, response):
            """处理AI响应（修复发送按钮禁用）"""
            self.remove_last_message()
            self.display_ai_message(response)
            self.btn_send.setEnabled(True)  # 恢复发送按钮
            self.statusBar().showMessage("✅ 回答完成")

        def handle_ai_error(self, error_msg):
            """处理AI错误（修复发送按钮禁用）"""
            self.remove_last_message()
            self.display_ai_message(f"❌ 抱歉，处理问题时出错：{error_msg}")
            self.btn_send.setEnabled(True)  # 恢复发送按钮
            self.statusBar().showMessage("❌ 处理失败")

        def remove_last_message(self):
            """精准移除“正在思考”消息（修复HTML切割错误）"""
            if not self.thinking_msg_flag:
                return
            # 获取当前聊天区HTML
            html = self.chat_display.toHtml()
            # 移除标识为「thinking」的消息块（核心：用唯一标识匹配）
            new_html = html.replace('<div id="thinking_msg">', '<!--removed-->')
            new_html = new_html.split('<!--thinking_end-->')[0] + (
                new_html.split('<!--thinking_end-->')[1] if len(new_html.split('<!--thinking_end-->')) > 1 else '')
            # 重新设置HTML并滚动到底部
            self.chat_display.setHtml(new_html)
            self.chat_display.ensureCursorVisible()
            self.thinking_msg_flag = False
# 创建AI工作线程
class InitAIWorker(QThread):
    """AI初始化专用线程"""
    init_success = pyqtSignal()
    init_failed = pyqtSignal(str)

    def __init__(self, rag_client):
        super().__init__()
        self.rag_client = rag_client

    def run(self):
        try:
            self.rag_client.initialize()  # 执行RAG初始化
            self.init_success.emit()
        except Exception as e:
            self.init_failed.emit(str(e))
class AIWorker(QThread):
    """AI处理工作线程"""

    # 定义信号
    response_received = pyqtSignal(str)
    error_occurred = pyqtSignal(str)

    def __init__(self, rag_client, question):
        super().__init__()
        self.rag_client = rag_client
        self.question = question

    def run(self):
        """线程运行函数"""
        try:
            response = self.rag_client.ask_question(self.question)
            self.response_received.emit(response)
        except Exception as e:
            self.error_occurred.emit(str(e))

