/**
由于本人很菜，变量命名为拼音命名法【狗头】,不想查英文，英文与拼音相比也不太直观，后续复看也不太方便
代码写的很垃圾，有很多重复的代码可以提取为方法，比如提取控件中心点，但是写了能跑就算了
而且没有做当前软件的包名检查，打开就直接运行了，需要改，主体全挤到一起了，非常的臃肿垃圾，好在能用
不知道为什么弹窗toast有很多会不弹出来显示，只有日志完整记录了
开始阅读垃圾代码吧，预计阅读4分钟
**/

//看到别人都用这个，我也用，貌似是用了之后，click这些无障碍操作就可以生效
auto();
//轮次
var cishu=1;
//开启录屏/截图权限申请，为后面的图像识别的截图做准备
if (!requestScreenCapture()) {
    toast("请求截图失败");
    console.log("请求截图失败");
    exit();
}
//识别率，也可以写死进去，实际的区域识别率大概在95%以上，所以只要满足90%就行
var shibielv = 0.9
//识别区域的坐标信息
var region = null;
//隐藏控件区域的中心坐标信息，实际就是屏幕中心上方空白的区域，点一下之后那些控件会自动关闭。用的是乘以测算的百分比
var yincang = [ device.height * 0.225,device.width * 0.69375];
//“我知道了”的控件的中心坐标
var zhidaolecenter=null;
//我知道了的控件的 矩阵信息
var wozhidaolebound = null;
//我知道了 控件对象
var wozhidaoleelements = null;
//“一键发表评论”的控件的中心坐标
var pingluncenter=null;
//“一键发表评论”的控件的 矩阵信息
var pinglunbound = null;
//“一键发表评论” 控件对象
var pinglunelements = null;

//图像识别福袋的函数
function searchfudai(fudai, shibielv, region) {
    //大图为屏幕截图
    let Bigpic = captureScreen()
    //小图为福袋图标的一小部分的截图
    let fudaipic1 = images.read("Images/" + fudai + ".png");
    //根据我的截图机器的分辨率对图像进行缩放，我的是3200*1440，小于这个设备的应该可以吧，大于的恐怕不行，需要优化
    let suofangx = device.width / 1440
    let suofangy = device.height / 3200
    //缩放
    let fudaipic = images.scale(fudaipic1, suofangx, suofangy)
    //开始识别，最大匹配为5，识别区域设定为福袋的识别区域 如果为空则是全屏 ，识别率为 0.9
    let result = images.matchTemplate(Bigpic, fudaipic, {
        max: 5,
        region: region||[0, 0, device.width, device.height], //区域
        threshold: shibielv,
    });
    console.log("福袋识别区域结果（坐标和相似度）:"+result.matches)
    //对识别结果提取福袋的坐标与中心坐标，中心坐标为坐上顶点坐标加上被识别图像的宽高的一半
    if (result != null) {
        for (let i = 0; i < result.matches.length; i++) {
            let pp = result.matches[i].point
            // log(pp)
            
            // console.nk
            console.log("找到福袋位置：" , pp.x, pp.y);
            // console.log("相对全屏坐标" + fudai, pp.x + region[0], pp.y + region[1]);  // 本来我推测如果是区域识别的话，坐标应该是匹配点的坐标加上福袋识别区域的坐标，但是不知道为什么不行
            console.log("福袋点击的中心坐标" + fudai, pp.x + fudaipic1.width / 2, pp.y + fudaipic1.height / 2);
            let matchX = pp.x  + fudaipic1.width / 2; // 匹配位置相对于整个大图的x坐标 63
            let matchY = pp.y  + fudaipic1.height / 2; // 匹配位置相对于整个大图的y坐标 63
            click(matchX , matchY)
            // click(pp.x, pp.y)
            //  log(pp.x, pp.y)
            console.log("点击福袋") 
            sleep(200)
            return true
        }
    } else {
        console.log("未找到福袋" )
        return false
    }
    // fudaipic1.recycle(); //图像回收是要的，以免内存泄漏，但是貌似导致了一些问题，所以没用
}



while(true){
    toast("下一轮");
    console.log("下一轮");
    toast("第"+cishu++ +"次抽福袋");
    console.log("第"+cishu+"轮");
    // 关闭我知道了的弹窗
    var wozhidaole2 = className("com.lynx.tasm.behavior.ui.view.UIView").desc("我知道了");
    //如果存在 我知道了 的弹窗
    if (wozhidaole2.exists()) {
        toast("关闭我知道了");
        console.log("新的一轮，关闭我知道了");
        if(zhidaolecenter==null){
            //找到具体的控件
            wozhidaoleelements = className("com.lynx.tasm.behavior.ui.view.UIView").desc("我知道了").find();
            if(wozhidaolebound==null){
                for (var i = 0; i < wozhidaoleelements.length; i++) {
                    if(wozhidaoleelements[i].bounds()!=null){
                        console.warn(wozhidaoleelements[i].bounds())
                        wozhidaolebound = [wozhidaoleelements[i].bounds().left, wozhidaoleelements[i].bounds().top, wozhidaoleelements[i].bounds().right, wozhidaoleelements[i].bounds().bottom]; // 存储当前元素的坐标值
                        break;
                    } // 获取当前元素的边界信息
                    
                }
                // 输出坐标数组
                console.log(wozhidaolebound);
            }
            //提取“我知道了”控件中心坐标
            var zhidaolecenterX = (wozhidaolebound[0] + wozhidaolebound[2]) / 2;
            var zhidaolecenterY = (wozhidaolebound[1] + wozhidaolebound[3]) / 2;
            zhidaolecenter = [zhidaolecenterX,zhidaolecenterY]
            console.log("我知道了的中心点："+zhidaolecenter);
        }
        click(zhidaolecenter[0],zhidaolecenter[1]);//关闭我知道了
        
        // click(yincang[0],yincang[1]);//隐藏所有控件
        sleep(3000);
    }
    click(yincang[0],yincang[1]);//隐藏所有控件,是屏幕中心上方的中心点
    console.log("查找福袋监控区域")
    var elements = className("android.widget.FrameLayout").id("ud0").find(); //福袋那一栏的控件
    //如果控件存在则提取监控区域的矩阵坐标信息
    if(region==null){
        for (var i = 0; i < elements.length; i++) {
            if(elements[i].bounds()!=null){
                // console.log(elements[i].bounds())
                region = [elements[i].bounds().left, elements[i].bounds().top, elements[i].bounds().right, elements[i].bounds().bottom]; // 存储当前元素的坐标值
                break;
            } // 获取当前元素的边界信息
            
        }
        // 输出数组
        // console.log(region);
        console.log("福袋监控区域："+region)

    }
    //福袋刚结束可能会在5秒内快速补充，以免进入30秒长时间倒计时
    console.log("休息5秒,等待新的福袋出现");
    sleep(5000);
    // if(region==null){continue;}
    // var targetControl = className("android.widget.FrameLayout").boundsInside(189,400,315,526).findOne();
    //开始识别福袋，其中的region 为我们刚刚在上面识别提取到的福袋监控区域的矩阵坐标信息
    if (searchfudai("fudai2", shibielv, region)) {
        toast("福袋存在");
        console.log("福袋存在");
        // click(252,463);
        sleep(3000);
        toast("开始检测发评论");
        console.log("开始检测发评论");
        var yijianfabiaopinglun = className("com.lynx.tasm.behavior.ui.view.UIView").desc("一键发表评论");
        //如果一键发评论的控件存在
        if(yijianfabiaopinglun.exists()){
            sleep(3000);
            toast("一键发表评论存在");
            console.log("一键发表评论存在");
            
            if(pingluncenter==null){

                pinglunelements = className("com.lynx.tasm.behavior.ui.view.UIView").desc("一键发表评论").find();
                
                //找到具体的控件坐标信息
                if(pinglunbound==null){
                    for (var i = 0; i < pinglunelements.length; i++) {
                        if(pinglunelements[i].bounds()!=null){
                            console.warn(pinglunelements[i].bounds())
                            pinglunbound = [pinglunelements[i].bounds().left, pinglunelements[i].bounds().top, pinglunelements[i].bounds().right, pinglunelements[i].bounds().bottom]; // 存储当前元素的坐标值
                            break;
                        } // 获取当前元素的边界信息
                        
                    }
                    // 输出数组
                    console.log(pinglunbound);
                }
                //计算控件中心点 pingluncenterX = (bounds().left+bounds().right)/2  pingluncenterY = (bounds().top + bounds().bottom) / 2;
                var pingluncenterX = (pinglunbound[0] + pinglunbound[2]) / 2;
                var pingluncenterY = (pinglunbound[1] + pinglunbound[3]) / 2;
                pingluncenter = [pingluncenterX,pingluncenterY]
                console.log("一键发评论的中心点："+pingluncenter);
            }
            click(pingluncenter[0],pingluncenter[1]);//点击发评论控件的中心点

            // click(727,2892);
            //点击后就查找参与成功的反馈
            var dengdaikaichoujiang = className("com.lynx.tasm.behavior.ui.view.UIView").desc("参与成功 等待抽奖").find();
            if(dengdaikaichoujiang){
                sleep(3000);
                toast("参与成功 等待抽奖");
                console.log("参与成功 等待抽奖");
                click(yincang[0],yincang[1]);//隐藏所有控件
                searchfudai("fudai2", shibielv, region)
                //sleep(120000);
                //continue; // 跳出当前循环
            }
        }
        else{
            toast("没找到发表评论");
            console.log("没找到发表评论");
            //对于加入粉丝团的，不进行操作并停止脚本运行
            if(className("com.lynx.tasm.behavior.ui.view.UIView").desc("加入粉丝团").exists()){
                toast("加入粉丝团,不可能的，不加，停止脚本");
                console.warn("加入粉丝团,不可能的，不加，停止脚本");
                break;
            }
            // click(yincang[0],yincang[1]);//隐藏所有控件
        }
        //等一会
        sleep(3000);
        //找一下参与成功后点击福袋原来 “一键发表评论” 位置的文本是否变为 "参与成功 等待开奖" ,判断是否参加成功
        var canyuchenggong = className("com.lynx.tasm.behavior.ui.view.UIView").desc("参与成功 等待开奖");
        //如果存在
        if(canyuchenggong.exists()){
            toast("参与成功 等待开奖");
            console.log("参与成功 等待开奖");
            // click(yincang[0],yincang[1]);//隐藏所有控件
            sleep(2000);
            toast("开始等待开奖");
            console.log("开始等待开奖，请耐心等待");
            //findOne的意思：刚学，不确定：findOne()会阻塞线程，直到找到目标的控件，否则会一直等待，因此我们确定参加成功后使用findOne等待结果而不是盲目操作
            var wozhidaole = className("com.lynx.tasm.behavior.ui.view.UIView").desc("我知道了").findOne();
            //我知道了控件找到后，也就是开奖了
            if (wozhidaole) {
                toast("关闭我知道了");
                console.log("开奖了，关闭我知道了");
                //如果我知道了的控件的中心点坐标信息为空，则需要重新获取，这里貌似可以沿用上面的wozhidaole？罢了写了就不想改了，能跑就行
                if(zhidaolecenter==null){
                    wozhidaoleelements = className("com.lynx.tasm.behavior.ui.view.UIView").desc("我知道了").find();
                    if(wozhidaolebound==null){
                        for (var i = 0; i < wozhidaoleelements.length; i++) {
                            if(wozhidaoleelements[i].bounds()!=null){
                                console.warn(wozhidaoleelements[i].bounds())
                                wozhidaolebound = [wozhidaoleelements[i].bounds().left, wozhidaoleelements[i].bounds().top, wozhidaoleelements[i].bounds().right, wozhidaoleelements[i].bounds().bottom]; // 存储当前元素的坐标值
                                break;
                            } // 获取当前元素的边界信息
                            
                        }
                        // 输出数组
                        console.log(wozhidaolebound);
                    }
                    //提取中心点坐标，中心点计算方式在上面一样的
                    var zhidaolecenterX = (wozhidaolebound[0] + wozhidaolebound[2]) / 2;
                    var zhidaolecenterY = (wozhidaolebound[1] + wozhidaolebound[3]) / 2;
                    zhidaolecenter = [zhidaolecenterX,zhidaolecenterY]
                    console.log("我知道了的中心点："+zhidaolecenter);
                }
                click(zhidaolecenter[0],zhidaolecenter[1]);//关闭我知道了
                sleep(3000);
                click(yincang[0],yincang[1]);//隐藏所有控件
                //别问为啥，菜鸟害怕这些变量携带旧的信息，手动置空
                wozhidaole = null;
                wozhidaole2 = null;
                canyuchenggong = null;
                dengdaikaichoujiang = null;
                targetControl = null;
                yijianfabiaopinglun = null;
                //确认开奖后就可以跳过这一轮了，进行下一轮
                continue;

                
            }
        }
        else{
            toast("没找到参与成功 等待开奖");
            console.log("没找到参与成功 等待开奖");
            click(yincang[0],yincang[1]);//隐藏所有控件
            wozhidaole = null;
            wozhidaole2 = null;
            canyuchenggong = null;
            dengdaikaichoujiang = null;
            targetControl = null;
            yijianfabiaopinglun = null;
            continue;

        }
    } else {
        toast("福袋不存在,等待30秒");
        console.log("福袋不存在,等待30秒");
        //如果不存在等30秒
        sleep(30000);
        click(yincang[0],yincang[1]);//隐藏所有控件
        wozhidaole = null;
        wozhidaole2 = null;
        canyuchenggong = null;
        dengdaikaichoujiang = null;
        targetControl = null;
        yijianfabiaopinglun = null;
        continue;
    }

}


