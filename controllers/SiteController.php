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
}
