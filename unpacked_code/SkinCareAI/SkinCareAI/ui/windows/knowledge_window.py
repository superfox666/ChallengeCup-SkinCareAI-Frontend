from PyQt5.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel,
                             QPushButton, QListWidget, QTextEdit, QFileDialog,
                             QProgressBar, QMessageBox, QGroupBox, QTreeWidget,
                             QTreeWidgetItem, QSplitter，Qwenu)
from PyQt5.QtCore import Qt, pyqtSignal
import os


class KnowledgeWindow(QWidget):
    """知识库管理窗口"""

    def __init__(self):
        super().__init__()
        self.init_ui()
        # 在 __init__ 中添加
        self.file_tree.setContextMenuPolicy(Qt.CustomContextMenu)
        self.file_tree.customContextMenuRequested.connect(self.show_context_menu)

    def show_context_menu(self, pos):
            menu = QMenu()
            upload_action = menu.addAction("上传文件到此处")
            delete_action = menu.addAction("删除")
            action = menu.exec_(self.file_tree.mapToGlobal(pos))
            if action == upload_action:
                self.upload_document()
            elif action == delete_action:
                self.delete_document()

    def init_ui(self):
        """初始化界面"""
        layout = QVBoxLayout(self)

        # 标题
        title_label = QLabel("📚 知识库管理系统")
        title_label.setStyleSheet("""
            QLabel {
                font-size: 18px;
                font-weight: bold;
                color: #333;
                padding: 15px;
                border-bottom: 2px solid #1E90FF;
            }
        """)
        layout.addWidget(title_label)

        # 创建分割器
        splitter = QSplitter(Qt.Horizontal)

        # 左侧：文件管理
        left_panel = self.create_file_panel()

        # 右侧：预览和操作
        right_panel = self.create_preview_panel()

        splitter.addWidget(left_panel)
        splitter.addWidget(right_panel)
        splitter.setSizes([300, 700])

        layout.addWidget(splitter)

    def create_file_panel(self):
        """创建文件管理面板"""
        panel = QWidget()
        layout = QVBoxLayout(panel)

        # 操作按钮组
        btn_group = QGroupBox("操作")
        btn_layout = QHBoxLayout()

        self.btn_upload = QPushButton("📤 上传文档")
        self.btn_delete = QPushButton("🗑️ 删除")
        self.btn_refresh = QPushButton("🔄 刷新")

        for btn in [self.btn_upload, self.btn_delete, self.btn_refresh]:
            btn.setStyleSheet("""
                QPushButton {
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 13px;
                }
                QPushButton:hover {
                    background-color: #F0F0F0;
                }
            """)
            btn_layout.addWidget(btn)

        btn_group.setLayout(btn_layout)
        layout.addWidget(btn_group)

        # 文件树
        self.file_tree = QTreeWidget()
        self.file_tree.setHeaderLabel("知识库文档")
        self.file_tree.setStyleSheet("""
            QTreeWidget {
                border: 1px solid #E0E0E0;
                border-radius: 4px;
                font-size: 13px;
            }
            QTreeWidget::item {
                padding: 5px;
            }
            QTreeWidget::item:selected {
                background-color: #E3F2FD;
            }
        """)

        # 模拟数据
        self.load_file_tree()

        layout.addWidget(self.file_tree)

        # 连接信号
        self.btn_upload.clicked.connect(self.upload_document)
        self.btn_delete.clicked.connect(self.delete_document)
        self.btn_refresh.clicked.connect(self.load_file_tree)

        return panel

    def create_preview_panel(self):
        """创建预览面板"""
        panel = QWidget()
        layout = QVBoxLayout(panel)

        # 文档预览
        preview_group = QGroupBox("文档预览")
        preview_layout = QVBoxLayout()

        self.preview_text = QTextEdit()
        self.preview_text.setReadOnly(True)
        self.preview_text.setStyleSheet("""
            QTextEdit {
                border: 1px solid #E0E0E0;
                border-radius: 4px;
                font-size: 13px;
                padding: 10px;
                min-height: 300px;
            }
        """)

        preview_layout.addWidget(self.preview_text)
        preview_group.setLayout(preview_layout)
        layout.addWidget(preview_group)

        # 向量库操作
        vector_group = QGroupBox("向量数据库操作")
        vector_layout = QVBoxLayout()

        self.btn_rebuild = QPushButton("🔨 重建向量库")
        self.btn_rebuild.setStyleSheet("""
            QPushButton {
                background-color: #FF9800;
                color: white;
                padding: 10px;
                border-radius: 4px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #F57C00;
            }
        """)

        self.progress_bar = QProgressBar()
        self.progress_bar.setVisible(False)

        vector_layout.addWidget(self.btn_rebuild)
        vector_layout.addWidget(self.progress_bar)
        vector_group.setLayout(vector_layout)
        layout.addWidget(vector_group)

        # 连接信号
        self.file_tree.itemClicked.connect(self.preview_document)
        self.btn_rebuild.clicked.connect(self.rebuild_vector_store)

        return panel

    def load_file_tree(self):
        """加载文件树"""
        self.file_tree.clear()

        # 模拟知识库结构
        categories = {
            "中医皮肤科": ["中医基础理论.txt", "中药方剂大全.pdf", "针灸疗法.docx"],
            "西医皮肤科": ["皮肤病学基础.pdf", "西药治疗指南.docx", "临床案例.md"],
            "中西医结合": ["结合治疗原则.txt", "成功案例集.pdf"]
        }

        for category, files in categories.items():
            category_item = QTreeWidgetItem(self.file_tree, [category])
            for file in files:
                file_item = QTreeWidgetItem(category_item, [file])

    def upload_document(self):
        files, _ = QFileDialog.getOpenFileNames(
            self, "选择文档", "",
            "文档文件 (*.txt *.pdf *.docx *.md);;所有文件 (*.*)"
        )
        if files:
            # 实际操作：将文件复制到 data/ 下的对应目录
            import shutil
            target_dir = "data/中医皮肤科"  # 这里可以让用户选择分类
            for file in files:
                try:
                    shutil.copy(file, target_dir)
                except Exception as e:
                    QMessageBox.warning(self, "错误", f"上传 {file} 失败：{str(e)}")
            QMessageBox.information(self, "上传成功", f"已上传 {len(files)} 个文件到知识库")
            self.load_file_tree()  # 刷新文件树

    def preview_document(self, item):
        if item.parent():  # 如果是文件项
            file_name = item.text(0)
            # 获取完整文件路径
            category = item.parent().text(0)
            file_path = os.path.join("data", category, file_name)

            if os.path.exists(file_path):
                try:
                    # 根据文件类型加载内容
                    if file_path.endswith(".txt"):
                        with open(file_path, "r", encoding="utf-8") as f:
                            content = f.read()
                    elif file_path.endswith(".pdf"):
                        from langchain_community.document_loaders import PyPDFLoader
                        loader = PyPDFLoader(file_path)
                        pages = loader.load()
                        content = "\n".join([page.page_content for page in pages])
                    # ... 其他文件类型处理
                    self.preview_text.setPlainText(content)
                except Exception as e:
                    self.preview_text.setPlainText(f"无法预览文件：{str(e)}")

    def delete_document(self):
        """删除文档"""
        current_item = self.file_tree.currentItem()
        if current_item and current_item.parent():
            reply = QMessageBox.question(
                self, "确认删除",
                f"确定要删除 '{current_item.text(0)}' 吗？",
                QMessageBox.Yes | QMessageBox.No
            )

            if reply == QMessageBox.Yes:
                parent = current_item.parent()
                parent.removeChild(current_item)

    # 在 KnowledgeWindow 中修改 rebuild_vector_store
    def rebuild_vector_store(self):
        reply = QMessageBox.question(self, "确认重建",
                                     "重建向量库需要一些时间，确定要继续吗？",
                                     QMessageBox.Yes | QMessageBox.No)
        if reply == QMessageBox.Yes:
            self.progress_bar.setVisible(True)
            self.progress_bar.setRange(0, 100)
            self.worker = RebuildWorker()
            self.worker.progress_updated.connect(self.progress_bar.setValue)
            self.worker.finished.connect(self.on_rebuild_finished)
            self.worker.start()

    def on_rebuild_finished(self, success):
        self.progress_bar.setVisible(False)
        if success:
            QMessageBox.information(self, "完成", "向量库重建完成！")
        else:
            QMessageBox.critical(self, "错误", "向量库重建失败！")

class RebuildWorker(QThread):
    progress_updated = pyqtSignal(int)
    finished = pyqtSignal(bool)

    def run(self):
        try:
            # 模拟重建过程，实际调用你的 vector_store.create_vector_store()
            for i in range(101):
                self.progress_updated.emit(i)
                self.msleep(20)
            self.finished.emit(True)
        except Exception as e:
            self.finished.emit(False)

