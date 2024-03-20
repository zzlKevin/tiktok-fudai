auto();
var cishu=1;

if (!requestScreenCapture()) {
    toast("请求截图失败");
    console.log("请求截图失败");
    exit();
}

var shibielv = 0.9
var region = null;
var yincang = [ device.height * 0.225,device.width * 0.69375];
var zhidaolecenter=null;
var pingluncenter=null;
function searchfudai(fudai, shibielv, region) {
 
    let Bigpic = captureScreen()
    let fudaipic1 = images.read("Images/" + fudai + ".png");
    let suofangx = device.width / 1440
    let suofangy = device.height / 3200
    let fudaipic = images.scale(fudaipic1, suofangx, suofangy)
    let result = images.matchTemplate(Bigpic, fudaipic, {
        max: 5,
        region: region||[0, 0, device.width, device.height], //区域
        threshold: shibielv,
    });
    console.log("福袋识别区域结果（坐标和相似度）:"+result.matches)
    if (result != null) {
        for (let i = 0; i < result.matches.length; i++) {
            let pp = result.matches[i].point
            // log(pp)
            
            // console.nk
            console.log("找到福袋位置：" , pp.x, pp.y);
            // console.log("相对全屏坐标" + fudai, pp.x + region[0], pp.y + region[1]);
            console.log("福袋点击的中心坐标" + fudai, pp.x + fudaipic1.width / 2, pp.y + fudaipic1.height / 2);
            let matchX = pp.x  + fudaipic1.width / 2; // 匹配位置相对于整个大图的x坐标 63
            let matchY = pp.y  + fudaipic1.height / 2; // 匹配位置相对于整个大图的y坐标 63
            click(matchX , matchY)
            // click(pp.x, pp.y)
            //  log(pp.x, pp.y)
            console.error("点击福袋")
            sleep(200)
            return true
        }
    } else {
        console.log("未找到福袋" )
        return false
    }
    // fudaipic1.recycle();
}



while(true){
    toast("下一轮");
    console.log("下一轮");
    toast(cishu++);
    console.log("第"+cishu+"轮");
    // var wozhidaole2 = className("com.lynx.tasm.behavior.ui.view.UIView").desc("我知道了").find();
    var wozhidaole2 = className("com.lynx.tasm.behavior.ui.view.UIView").desc("我知道了");
    if (wozhidaole2.exists()) {
        toast("关闭我知道了");
        console.log("新的一轮，关闭我知道了");
        if(zhidaolecenter==null){
            var wozhidaoleelements = className("com.lynx.tasm.behavior.ui.view.UIView").desc("我知道了").find();
            var wozhidaolebound = null;
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
            var zhidaolecenterX = (wozhidaolebound[0] + wozhidaolebound[2]) / 2;
            var zhidaolecenterY = (wozhidaolebound[1] + wozhidaolebound[3]) / 2;
            zhidaolecenter = [zhidaolecenterX,zhidaolecenterY]
            console.log("我知道了的中心点："+zhidaolecenter);
        }
        click(zhidaolecenter[0],zhidaolecenter[1]);//关闭我知道了
        
        // click(yincang[0],yincang[1]);//隐藏所有控件
        sleep(3000);
    }
    click(yincang[0],yincang[1]);//隐藏所有控件
    console.log("查找福袋监控区域")
    var elements = className("android.widget.FrameLayout").id("ud0").find();
    
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
    console.log("休息5秒,等待新的福袋出现");
    sleep(5000);
    // if(region==null){continue;}
    // var targetControl = className("android.widget.FrameLayout").boundsInside(189,400,315,526).findOne();
    if (searchfudai("fudai2", shibielv, region)) {
        toast("福袋存在");
        console.log("福袋存在");
        // click(252,463);
        sleep(3000);
        toast("开始检测发评论");
        console.log("开始检测发评论");
        var yijianfabiaopinglun = className("com.lynx.tasm.behavior.ui.view.UIView").desc("一键发表评论");
        if(yijianfabiaopinglun.exists()){
            sleep(3000);
            toast("一键发表评论存在");
            console.log("一键发表评论存在");
            if(pingluncenter==null){
                var pinglunelements = className("com.lynx.tasm.behavior.ui.view.UIView").desc("一键发表评论").find();
                var pinglunbound = null;
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
                var pingluncenterX = (pinglunbound[0] + pinglunbound[2]) / 2;
                var pingluncenterY = (pinglunbound[1] + pinglunbound[3]) / 2;
                pingluncenter = [pingluncenterX,pingluncenterY]
                console.log("一键发评论的中心点："+pingluncenter);
            }
            click(pingluncenter[0],pingluncenter[1]);//点击发评论

            // click(727,2892);
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
            if(className("com.lynx.tasm.behavior.ui.view.UIView").desc("加入粉丝团").exists()){
                toast("加入粉丝团,不可能的，不加，停止脚本");
                console.warn("加入粉丝团,不可能的，不加，停止脚本");

                break;
            }
            // click(yincang[0],yincang[1]);//隐藏所有控件
        }
        sleep(3000);
        
        var canyuchenggong = className("com.lynx.tasm.behavior.ui.view.UIView").desc("参与成功 等待开奖");
        if(canyuchenggong.exists()){
            toast("参与成功 等待开奖");
            console.log("参与成功 等待开奖");
            // click(yincang[0],yincang[1]);//隐藏所有控件
            sleep(2000);
            toast("开始等待开奖");
            console.log("开始等待开奖，请耐心等待");
            var wozhidaole = className("com.lynx.tasm.behavior.ui.view.UIView").desc("我知道了").findOne();
            if (wozhidaole) {
                toast("关闭我知道了");
                console.log("开奖了，关闭我知道了");
                if(zhidaolecenter==null){
                    var wozhidaoleelements = className("com.lynx.tasm.behavior.ui.view.UIView").desc("我知道了").find();
                    var wozhidaolebound = null;
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
                    var zhidaolecenterX = (wozhidaolebound[0] + wozhidaolebound[2]) / 2;
                    var zhidaolecenterY = (wozhidaolebound[1] + wozhidaolebound[3]) / 2;
                    zhidaolecenter = [zhidaolecenterX,zhidaolecenterY]
                    console.log("我知道了的中心点："+zhidaolecenter);
                }
                click(zhidaolecenter[0],zhidaolecenter[1]);//关闭我知道了
                sleep(3000);
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


