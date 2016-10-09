var window_fileName;//被移动的工作区的url地址
var iframe_html = "";//被移动的工作区的名字
var window_title;//被移动的工作区
var solution_space_width = 230;//默认解决方案宽度
var working_space_width = 850;//默认工作区宽度
var working_space_height = 330;//默认工作区高度
var move_state = false;//移动标识
var drag_state = false;//拖动缩放标识
var url = "http://www.baidu.com/";//测试url
var describeJson = new Array();//当前页面操作后的json数组存储
var panel_flag = "";//当前页面是否发生变更
var panels = 0;//记录各个工作区的面板数量
var sizeMap = new HashMap();//记录某app是否最大化的信息
var appUrlMap = new HashMap();//记录需要加载app的URL信息
var isLoading = false;//是否正在加载中
