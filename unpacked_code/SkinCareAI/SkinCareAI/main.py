import os
import sys

# 强制设置 Qt 平台插件路径（保持你本地的路径配置）
os.environ[
    "QT_QPA_PLATFORM_PLUGIN_PATH"] = r"c:\users\-李正宇-\appdata\roaming\python\python310\site-packages\PyQt5\Qt5\plugins"

# 导入 PyQt5 相关模块
from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget, QPushButton, QTextEdit, QLabel
from PyQt5.QtCore import QThread, pyqtSignal

# 添加上下文路径，确保模块导入正确
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 导入核心业务模块
from scripts.skin_care_ai import SkinCareAI
from scripts.document_processor import DocumentProcessor
from scripts.vector_store import VectorStoreManager


# 后台工作线程：初始化知识库和向量库
class InitWorker(QThread):
    finished = pyqtSignal(bool)

    def run(self):
        try:
            # 在这里执行核心逻辑：处理文档 -> 创建向量库
            # 注意：移除了所有 input()，直接使用默认配置
            processor = DocumentProcessor()
            chunks = processor.process_all_knowledge()

            if not chunks:
                self.finished.emit(False)
                return

            manager = VectorStoreManager()
            manager.create_vector_store(chunks)

            self.finished.emit(True)
        except Exception as e:
            print(f"初始化失败: {e}")
            self.finished.emit(False)


# 主窗口类
class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("皮肤护理AI助手")
        self.setGeometry(100, 100, 800, 600)

        # 初始化AI实例
        self.ai = None

        # 构建UI界面
        self.init_ui()

    def init_ui(self):
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)

        # 状态标签
        self.status_label = QLabel("点击下方按钮初始化知识库...")
        layout.addWidget(self.status_label)

        # 初始化按钮
        self.init_btn = QPushButton("初始化知识库")
        self.init_btn.clicked.connect(self.start_init)
        layout.addWidget(self.init_btn)

        # 聊天显示区域
        self.chat_display = QTextEdit()
        self.chat_display.setReadOnly(True)
        layout.addWidget(self.chat_display)

        # 输入框
        self.input_edit = QTextEdit()
        self.input_edit.setFixedHeight(80)
        layout.addWidget(self.input_edit)

        # 发送按钮
        self.send_btn = QPushButton("发送")
        self.send_btn.clicked.connect(self.send_question)
        self.send_btn.setEnabled(False)
        layout.addWidget(self.send_btn)

    def start_init(self):
        """点击初始化按钮后的逻辑"""
        self.init_btn.setEnabled(False)
        self.status_label.setText("正在初始化知识库...")

        # 启动后台线程
        self.init_worker = InitWorker()
        self.init_worker.finished.connect(self.on_init_finished)
        self.init_worker.start()

    def on_init_finished(self, success):
        """线程完成后的回调"""
        if success:
            self.status_label.setText("知识库初始化完成，AI已就绪！")
            self.ai = SkinCareAI()
            self.send_btn.setEnabled(True)
        else:
            self.status_label.setText("知识库初始化失败，请检查配置。")
            self.init_btn.setEnabled(True)

    def send_question(self):
        """发送问题"""
        question = self.input_edit.toPlainText().strip()
        if not question or not self.ai:
            return

        # 显示用户问题
        self.chat_display.append(f"用户: {question}")
        self.input_edit.clear()

        # 原始的简易线程调用方式
        self.ask_worker = QThread()
        self.ask_worker.run = lambda: self.get_ai_answer(question)
        self.ask_worker.start()

    def get_ai_answer(self, question):
        """获取AI回答（在子线程中运行）"""
        answer = self.ai.ask(question)
        # 注意：这里直接更新UI在严格意义上不规范，但这是你最初的代码逻辑
        self.chat_display.append(f"AI: {answer}")


# 程序入口
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())