using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace LX.GameCenter.Web.Controllers
{
    public class GameController : Controller
    {
        private static string appID = "wx673145934e1ff68f";
        private static string appSecret = "2385e9446f095435be35a07b0ef25748";
        private static string token = "zzXEHrfs3878ypdWcy4xhExL2oiegsrtLaazMp99k-gGd57yERZu3funWvKZJttojKCQUEXC3TNy4mBX9M2BgC8cBh3o4i3B-u6ttjI7C2mieIwuErBaDSkx4Gi_G40CQFPhAGAKZJ";
        private static string ticket = "sM4AOVdWfPE4DxkXGEs8VN-FKbjaLPWgLOwHG-U6bzSzz0NlT3uNtoNqp477uyTTxlqGu3_wtVsqpTS95S6izQ";
        private static string redirectUrl = "http://yys.wificun.net/menu/gamestart?gameid=80";

        // GET: Game
        public ActionResult Index()
        {
            //var code = Request.QueryString["code"];
            //var str = "";
            ////编码网址
            //var url = HttpUtility.UrlEncode(redirectUrl);
            //try
            //{
            //    //网页授权并带回code
            //    str = Authorize.GetWeiXinCodeUserInfo(appID, url);
            //}
            //catch (Exception)
            //{
            //    throw;
            //}
            ////获取token并存储为Model
            //Core.Weixin.Model.AccessToken accessToken = Authorize.GetWeiXinAccessToken(appID, appSecret, "041ouWti2EEkFM0YIiti21jSti2ouWtK");
            //accessToken = Authorize.RefreshWeiXinAccessToken(appID, accessToken.access_token);
            ////获取用户信息
            //Core.Weixin.Model.UserInfo userIfo = Authorize.GetWeiXinUserInfo(accessToken.access_token, accessToken.openid);
            //ViewBag.lst = str;
            return View();
        }
        public ActionResult Hall()
        {
            return View();
        }
        public ActionResult Projection()
        {
            return View();
        }
        //public ActionResult Wechat()
        //{
        //    var code = Request.QueryString["code"];
        //    var str = "";
        //    //编码网址
        //    var url = HttpUtility.UrlEncode(redirectUrl);
        //    try
        //    {
        //        //网页授权并带回code
        //        str = Authorize.GetWeiXinCodeUserInfo(appID, url);
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //    //获取token并存储为Model
        //    Core.Weixin.Model.AccessToken accessToken = Authorize.GetWeiXinAccessToken(appID, appSecret, code);
        //    accessToken = Authorize.RefreshWeiXinAccessToken(appID, accessToken.access_token);
        //    //获取用户信息
        //    Core.Weixin.Model.UserInfo userIfo = Authorize.GetWeiXinUserInfo(accessToken.access_token, accessToken.openid);
        //    ViewBag.lst = code;
        //    ViewBag.lst2 = str;
        //    Console.WriteLine(code);
        //    return View();
        //}
        public static string UrlEncode(string redirectUrl)
        {
            //自定义全部编码
            StringBuilder sb = new StringBuilder();
            byte[] byStr = System.Text.Encoding.UTF8.GetBytes(redirectUrl); //默认是System.Text.Encoding.Default.GetBytes(str)
            for (int i = 0; i < byStr.Length; i++)
            {
                sb.Append(@"%" + Convert.ToString(byStr[i], 16));
            }

            return (sb.ToString());
        }
    }
}