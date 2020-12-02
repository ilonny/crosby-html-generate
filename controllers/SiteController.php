<?php

namespace app\controllers;

use Yii;
// use yii\filters\AccessControl;
use yii\web\Controller;
// use yii\web\Response;
// use yii\filters\VerbFilter;
// use app\models\LoginForm;
// use app\models\ContactForm;
use app\models\Item;
class SiteController extends Controller
{

    public $enableCsrfValidation = false;
    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::className(),
            'cors' => [
                'Access-Control-Allow-Origin' => ['*'],
                'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
                'Access-Control-Request-Headers' => ['*'],
                'Access-Control-Allow-Credentials' => true,
                'Access-Control-Max-Age' => 86400,
                'Access-Control-Expose-Headers' => [],
            ]
        ];
        return $behaviors;
    }
    /**
     * {@inheritdoc}
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex()
    {
        return $this->render('index');
    }


    public function actionUpload() {
        Yii::$app->response->headers->add('Access-Control-Allow-Origin', 'http://localhost:3000');
        // $tmp_name = $_FILES['avatar'];
        // var_dump($_FILES);
        // $name = basename($_FILES["pictures"]["name"]);
        // move_uploaded_file($tmp_name, "uploads");
        // return $this->asJson($tmp_name);
        $res = [];
        foreach ($_FILES as $key => $file) {
            $tmp_name = $file['tmp_name'];
            $name = basename($file['name']);
            move_uploaded_file($tmp_name, "uploads/$name");
            // return $this->asJson(['res' => "uploads/$name"]);
            return $this->asJson("uploads/$name");
            // $tmp_name = $file["tmp_name"];
        }
    }

    public function actionSave() {
        $body = json_decode(file_get_contents('php://input'), JSON_UNESCAPED_UNICODE);
        if ($body['id']) {
            $model = Item::findOne($body['id']);
            $model->data = json_encode($body['data']);
            $model->update();
            return $this->asJson($model);
        } else {
            $model = new Item;
            $model->data = json_encode($body['data']);
            $model->save();
            return $this->asJson($model);
        }
        // var_dump($body['data']);
        // var_dump($body);
        // var_dump([123 => 333]);
        // var_dump($body2);
    }

    public function actionData($id) {
        $model = Item::findOne($id);
        return $this->asJson(['data' => $model->data]);
        // var_dump($body['data']);
        // var_dump($body);
        // var_dump([123 => 333]);
        // var_dump($body2);
    }

    public function actionGetAll() {
        return $this->asJson(Item::find()->all());
    }

    public function actionDelete($id) {
        $model = Item::findOne($id);
        if ($model->delete()) {
            return $this->asJson(['status' => 'ok']);
        }
    }

    public function actionGetHtml($download = false) {
        error_reporting(E_ERROR | E_PARSE);
        $body = json_decode(file_get_contents('php://input'), JSON_UNESCAPED_UNICODE);
        $data = $body['data'];
        // $items = json_decode($data, JSON_UNESCAPED_UNICODE);

        $jq = file_get_contents('https://code.jquery.com/jquery-3.5.1.slim.min.js');
        $slick = file_get_contents('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js');
        $html = '
        <!-- основная обертка контента (белый блок с круглыми границами) -->
        <div class="wrapper">
            <div class="qq" style="position: relative;">
                <div class="arr-left">←</div>
                <div class="arr-right">←</div>
                <!-- обертка слайдера картиинок, каждой картинке вписать свой src -->
                <div class="slider-wrapper">
                ';
                foreach ($data as $key => $item) {
                    $html .= '
                        <div>
                            <!-- заголовок айтема -->
                            ';
                        if ($item['name']) {
                            $html .= '<p class="item-title">'.$item['name'].'</p>';
                        }
                        if ($item['price']) {
                            $html .= '<p class="price">'.$item['price'].'</p>';
                        }
                        if ($item['image']) {
                            $html .= '<img src="http://localhost:8000/'.$item['image'].'" style="max-width: 100%; margin: auto" />';
                        }
                        if ($item['descrip']) {
                            $html .= '
                                <!-- серый текст описаниия товара -->
                                <p class="description" style="margin-top: 20px">'.$item['descrip'].'</p>
                            ';
                        }
                    $html .= '
                        <div class="flex-wrapper">
                    ';
                        if ($item['buy_link']) {
                            $html .= '<a href="'.$item['buy_link'].'" class="tn-atom" style="flex: '.($item['ar_link'] ? '1' : '0.5').'"><span>BY</span></a>';
                        }
                        if ($item['ar_link']) {
                            $html .= '
                                <a
                                href="'.$item['ar_link'].'"
                                target="_blank"
                                class="tn-atom__image"
                                style="margin: 0; margin-left: 0px; display: flex; justify-content: center;"
                                >
                                    <img
                                        class="tn-atom__img"
                                        src="https://d2gp3uv98k6j5c.cloudfront.net/assets/tours/files/00/00/24/9280-2c3024/images/tild3061-6266-4661-b064-623333363137__group_187.svg"
                                        imgfield="tn_img_1596555954093"/>
                                </a>
                            ';
                        }
                    $html .= '
                        </div>
                    ';
                    if ($item['preorder_link']) {
                        $html .= '
                            <!-- обертка если одна кнопка (к ссылке добавляется style="flex: 0.5") -->
                            <div class="flex-wrapper">
                                <a
                                    href="'.$item['preorder_link'].'"
                                    class="tn-atom"
                                    style="flex: 0.5"
                                    ><span>PREORDER</span></a
                                >
                            </div>
                        ';
                    }
                    if ($item['coming']) {
                        $html .= '<p class="coming">COMING SOON</p>';
                    }
                    $html .= '
                        </div>
                    ';
                }
                $html .='
                </div>
            </div>
        </div>
        ';
        $html .= "
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
         @font-face{font-family:Inter;font-style:normal;font-weight:100;font-display:swap;src:url(\"Inter (web hinted)/Inter-Thin.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-Thin.woff\") format(\"woff\")}@font-face{font-family:Inter;font-style:italic;font-weight:100;font-display:swap;src:url(\"Inter (web hinted)/Inter-ThinItalic.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-ThinItalic.woff\") format(\"woff\")}@font-face{font-family:Inter;font-style:normal;font-weight:200;font-display:swap;src:url(\"Inter (web hinted)/Inter-ExtraLight.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-ExtraLight.woff\") format(\"woff\")}@font-face{font-family:Inter;font-style:italic;font-weight:200;font-display:swap;src:url(\"Inter (web hinted)/Inter-ExtraLightItalic.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-ExtraLightItalic.woff\") format(\"woff\")}@font-face{font-family:Inter;font-style:normal;font-weight:300;font-display:swap;src:url(\"Inter (web hinted)/Inter-Light.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-Light.woff\") format(\"woff\")}@font-face{font-family:Inter;font-style:italic;font-weight:300;font-display:swap;src:url(\"Inter (web hinted)/Inter-LightItalic.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-LightItalic.woff\") format(\"woff\")}@font-face{font-family:Inter;font-style:normal;font-weight:400;font-display:swap;src:url(\"Inter (web hinted)/Inter-Regular.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-Regular.woff\") format(\"woff\")}@font-face{font-family:Inter;font-style:italic;font-weight:400;font-display:swap;src:url(\"Inter (web hinted)/Inter-Italic.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-Italic.woff\") format(\"woff\")}@font-face{font-family:Inter;font-style:normal;font-weight:500;font-display:swap;src:url(\"Inter (web hinted)/Inter-Medium.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-Medium.woff\") format(\"woff\")}@font-face{font-family:Inter;font-style:italic;font-weight:500;font-display:swap;src:url(\"Inter (web hinted)/Inter-MediumItalic.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-MediumItalic.woff\") format(\"woff\")}@font-face{font-family:Inter;font-style:normal;font-weight:600;font-display:swap;src:url(\"Inter (web hinted)/Inter-SemiBold.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-SemiBold.woff\") format(\"woff\")}@font-face{font-family:Inter;font-style:italic;font-weight:600;font-display:swap;src:url(\"Inter (web hinted)/Inter-SemiBoldItalic.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-SemiBoldItalic.woff\") format(\"woff\")}@font-face{font-family:Inter;font-style:normal;font-weight:700;font-display:swap;src:url(\"Inter (web hinted)/Inter-Bold.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-Bold.woff\") format(\"woff\")}@font-face{font-family:Inter;font-style:italic;font-weight:700;font-display:swap;src:url(\"Inter (web hinted)/Inter-BoldItalic.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-BoldItalic.woff\") format(\"woff\")}@font-face{font-family:Inter;font-style:normal;font-weight:800;font-display:swap;src:url(\"Inter (web hinted)/Inter-ExtraBold.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-ExtraBold.woff\") format(\"woff\")}@font-face{font-family:Inter;font-style:italic;font-weight:800;font-display:swap;src:url(\"Inter (web hinted)/Inter-ExtraBoldItalic.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-ExtraBoldItalic.woff\") format(\"woff\")}@font-face{font-family:Inter;font-style:normal;font-weight:900;font-display:swap;src:url(\"Inter (web hinted)/Inter-Black.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-Black.woff\") format(\"woff\")}@font-face{font-family:Inter;font-style:italic;font-weight:900;font-display:swap;src:url(\"Inter (web hinted)/Inter-BlackItalic.woff2\") format(\"woff2\"),url(\"Inter (web hinted)/Inter-BlackItalic.woff\") format(\"woff\")}
         @charset 'UTF-8';.slick-loading .slick-list{background:#fff url(ajax-loader.gif) center center no-repeat}@font-face{font-family:slick;font-weight:400;font-style:normal;src:url(fonts/slick.eot);src:url(fonts/slick.eot?#iefix) format('embedded-opentype'),url(fonts/slick.woff) format('woff'),url(fonts/slick.ttf) format('truetype'),url(fonts/slick.svg#slick) format('svg')}.slick-next,.slick-prev{font-size:0;line-height:0;position:absolute;top:50%;display:block;width:20px;height:20px;padding:0;-webkit-transform:translate(0,-50%);-ms-transform:translate(0,-50%);transform:translate(0,-50%);cursor:pointer;color:transparent;border:none;outline:0;background:0 0}.slick-next:focus,.slick-next:hover,.slick-prev:focus,.slick-prev:hover{color:transparent;outline:0;background:0 0}.slick-next:focus:before,.slick-next:hover:before,.slick-prev:focus:before,.slick-prev:hover:before{opacity:1}.slick-next.slick-disabled:before,.slick-prev.slick-disabled:before{opacity:.25}.slick-next:before,.slick-prev:before{font-family:slick;font-size:20px;line-height:1;opacity:.75;color:#fff;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.slick-prev{left:-25px}[dir=rtl] .slick-prev{right:-25px;left:auto}.slick-prev:before{content:'←'}[dir=rtl] .slick-prev:before{content:'→'}.slick-next{right:-25px}[dir=rtl] .slick-next{right:auto;left:-25px}.slick-next:before{content:'→'}[dir=rtl] .slick-next:before{content:'←'}.slick-dotted.slick-slider{margin-bottom:30px}.slick-dots{position:absolute;bottom:-25px;display:block;width:100%;padding:0;margin:0;list-style:none;text-align:center}.slick-dots li{position:relative;display:inline-block;width:20px;height:20px;margin:0 5px;padding:0;cursor:pointer}.slick-dots li button{font-size:0;line-height:0;display:block;width:20px;height:20px;padding:5px;cursor:pointer;color:transparent;border:0;outline:0;background:0 0}.slick-dots li button:focus,.slick-dots li button:hover{outline:0}.slick-dots li button:focus:before,.slick-dots li button:hover:before{opacity:1}.slick-dots li button:before{font-family:slick;font-size:6px;line-height:20px;position:absolute;top:0;left:0;width:20px;height:20px;content:'•';text-align:center;opacity:.25;color:#000;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.slick-dots li.slick-active button:before{opacity:.75;color:#000}
        /*# sourceMappingURL=slick-theme.min.css.map */
        .slick-slider{position:relative;display:block;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-touch-callout:none;-khtml-user-select:none;-ms-touch-action:pan-y;touch-action:pan-y;-webkit-tap-highlight-color:transparent}.slick-list{position:relative;display:block;overflow:hidden;margin:0;padding:0}.slick-list:focus{outline:0}.slick-list.dragging{cursor:pointer;cursor:hand}.slick-slider .slick-list,.slick-slider .slick-track{-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);-ms-transform:translate3d(0,0,0);-o-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.slick-track{position:relative;top:0;left:0;display:block;margin-left:auto;margin-right:auto}.slick-track:after,.slick-track:before{display:table;content:''}.slick-track:after{clear:both}.slick-loading .slick-track{visibility:hidden}.slick-slide{display:none;float:left;height:100%;min-height:1px}[dir=rtl] .slick-slide{float:right}.slick-slide img{display:block}.slick-slide.slick-loading img{display:none}.slick-slide.dragging img{pointer-events:none}.slick-initialized .slick-slide{display:block}.slick-loading .slick-slide{visibility:hidden}.slick-vertical .slick-slide{display:block;height:auto;border:1px solid transparent}.slick-arrow.slick-hidden{display:none}
        /*# sourceMappingURL=slick.min.css.map */
                    html,
                    body {
                        background-color: black;
                        font-family: Inter;
                        /* background: gray; */
                    }
                    .wrapper {
                        /* background-color: #fff; */
                        /* padding: 20px; */
                        /* border-radius: 7px; */
                        /* background: red; */
                        /* max-width: 320px; */
                        margin: auto;
                        position: relative;
                    }
                    #mdiv {
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
        
                    .mdiv {
                        height: 13px;
                        width: 1px;
                        margin-left: 12px;
                        background-color: black;
                        transform: rotate(45deg);
                        z-index: 1;
                    }
        
                    .md {
                        height: 13px;
                        width: 1px;
                        background-color: black;
                        transform: rotate(90deg);
                        z-index: 2;
                    }
                    .close-btn {
                        background: transparent;
                        padding: 0;
                        border: none;
                        position: absolute;
                        top: -4px;
                        right: 0px;
                        text-decoration: none;
                    }
                    .item-title {
                        text-align: center;
                        margin-top: 0px;
                        margin-bottom: 20px;
                        color: black;
                    }
                    .slider-wrapper {
                        /* margin: 20px 0; */
                        text-align: center;
                        padding: 20px;
                        position: relative;
                    }
                    .slider-wrapper img {
                        border-radius: 7px;
                        max-width: 100%;
                    }
                    .qq {
                        /* padding: 0px 30px; */
                        position: relative;
                        border-radius: 7px;
                    }
                    .arr-left {
                        color: gray;
                        left: 0px;
                        position: absolute;
                        top: 50%;
                        z-index: 333;
                        font-size: 20px;
                        cursor: pointer;
                        padding: 10px;
                        margin-top: -20px;
                        display: block !important;
                    }
                    .arr-right {
                        color: gray;
                        right: 0px;
                        position: absolute;
                        top: 50%;
                        z-index: 333;
                        font-size: 20px;
                        cursor: pointer;
                        padding: 10px;
                        margin-top: -20px;
                        transform: rotate(180deg);
                      display: block !important;
                    }
                    .description {
                        color: rgb(125, 125, 125);
                        text-align: center;
                    }
                    .price {
                        color: #515050;
                        text-align: center;
                        margin-top: -15px;
                    }
                    .tn-atom {
                        height: 30px;
                        width: 100px;
                        text-align: center;
                        color: #ffffff;
                        font-size: 14px;
                        font-family: \"inter\", Arial, sans-serif;
                        line-height: 2.3;
                        font-weight: 400;
                        border-width: 1px;
                        border-radius: 30px;
                        background-color: #031ee8;
                        background-position: center center;
                        border-color: transparent;
                        border-style: solid;
                        transition: background-color 0.2s ease-in-out,
                            color 0.2s ease-in-out, border-color 0.2s ease-in-out;
                        display: inline-block;
                    }
                    .tn-atom:hover {
                        background-color: #000000;
                    }
                    .flex-wrapper {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 10px;
                    }
        
                    .flex-wrapper > a,
                    .flex-wrapper > div {
                        flex: 1;
                        display: block;
                        color: #fff;
                        text-decoration: none;
                    }
                    .tn-atom__image {
                        width: 100%;
                        margin-top: 12px;
                        text-align: center;
                        margin-top: 10px;
                    }
                    .coming {
                        text-align: center;
                        margin: 20px 0;
                        color: #031ee8;
                        margin-bottom: 0;
                    }
                    .slick-prev {
                        left: 5px !important;
                        z-index: 333;
                    }
                    .slick-next {
                        right: 5px !important;
                        z-index: 333;
                    }
                    .slider-wrapper {
                        padding: 0;
                    }
                    .slick-initialized .slick-slide {
                      max-width: initial;
                    }
                </style>
        ";
        // <script
        //     src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
        //     integrity="sha256-4+XzXVhsDmqanXGHaHvgh1gMQKX40OUvDEBTu8JcmNs="
        //     crossorigin="anonymous"></script>
        // <script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js" integrity="sha512-XtmMtDEcNz2j7ekrtHvOVR4iwwaD6o/FUJe6+Zq+HgcCsk3kj4uSQQR8weQ2QVj1o0Pk6PwYLohm206ZzNfubg==" crossorigin="anonymous"></script>
        $html .= '
        <script>'.$jq.'</script>
        <script>'.$slick.'</script>
            <script>
            console.log("pizdec?");
            $(document).ready(function () {
                $(".slider-wrapper").slick({
                    prevArrow: $(".arr-left"),
                    nextArrow: $(".arr-right"),
                    fade: true,
                });
            });
            </script>
        ';
        $script = '';
        $script .= 
        ''.$jq.'
        '.$slick.
        '
            console.log("pizdec?");
            $(document).ready(function () {
                $(".slider-wrapper").slick({
                    prevArrow: $(".arr-left"),
                    nextArrow: $(".arr-right"),
                    fade: true,
                });
            });
        ';
        if ($download) {
            // header('Content-Disposition: attachment; filename="code.html"');
            // print $html;
            $file = "test.txt";
            $txt = fopen($file, "w") or die("Unable to open file!");
            fwrite($txt, $html);
            fclose($txt);

            header('Content-Description: File Transfer');
            header('Content-Disposition: attachment; filename='.basename($file));
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($file));
            header("Content-Type: text/plain");
            readfile($file);
        } else {
        }
        return $this->asJson(['html' => $html, 'script' => $script]);
        // echo $html;
        // var_dump($data);
    }
}
