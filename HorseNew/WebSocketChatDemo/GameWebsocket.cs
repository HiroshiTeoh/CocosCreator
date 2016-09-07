using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using SuperWebSocket;
using System.Collections;
using HorseNew.Models;

namespace WebSocketChatDemo
{
    public class GameWebsocket
    {
        private const string ip = "192.168.0.25";
        private const int port = 2200;
        private WebSocketServer ws = null;//SuperWebSocket中的WebSocketServer对象
        private string msg = null;//传递的消息 0:open 1:close 2:begingame 3:move
        //房间和用户模型(新)
        private personList person;
        private roomList room;
        //private List<personList> personList=new List<personList>();
        private List<roomList> roomList = new List<roomList>();
        //房间和用户数组(旧)
        private ArrayList userID;//用户ID
        private ArrayList userArray = new ArrayList();//用户信息
        private ArrayList roomArray = new ArrayList();//房间信息

        public GameWebsocket()
        {
            ws = new WebSocketServer();//实例化WebSocketServer

            //添加事件侦听
            ws.NewSessionConnected += ws_NewSessionConnected;//有新会话握手并连接成功
            ws.SessionClosed += ws_SessionClosed;//有会话被关闭 可能是服务端关闭 也可能是客户端关闭
            ws.NewMessageReceived += ws_NewMessageReceived;//有客户端发送新的消息
        }


        void ws_NewSessionConnected(WebSocketSession session)
        {
            Console.WriteLine("{0:HH:MM:ss}  与客户端:{1}创建新的会话", DateTime.Now, GetSessionName(session));
            //var msg = string.Format("{0:HH:MM:ss} {1} 进入游戏等待界面", DateTime.Now, GetSessionName(session));

        }

        void ws_SessionClosed(WebSocketSession session, SuperSocket.SocketBase.CloseReason value)
        {
            Console.WriteLine("{0:HH:MM:ss}  与客户端:{1}的会话被关闭 原因：{2}", DateTime.Now, GetSessionName(session), value);

            //userID.Remove(session.SessionID);
            //userArray.Remove(GetSessionName(session));
            //for (int i = 0; i < userArray.Count; i++)
            //{
            //    msg += userArray[i] + "/";
            //    msg += userID[i] + "/";
            //}

            foreach (var itemroom in roomList)
            {
                var temp = 0;
                foreach (var itemperson in itemroom.Personlist)
                {
                    temp++;
                    if (itemperson.NickName == session.SessionID)
                    {
                        itemroom.Personlist.Remove(itemperson);//移除用户
                        break;
                    }
                }
                if (temp == 0)
                {
                    roomList.Remove(itemroom);//移除房间
                }

            }
            msg = "1/";
            foreach (var itemroom in roomList)
            {
                foreach (var itemperson in itemroom.Personlist)
                {
                    msg += itemperson.NickName + "/";
                    Console.WriteLine("关闭后人员:" + itemperson.NickName);
                }
                foreach (var itemperson in itemroom.Personlist)
                {
                    SendToUser(itemperson.NickName, msg);
                }

            }

        }
        void ws_NewMessageReceived(WebSocketSession session, string value)
        {
            //解析字符串
            var str= value.Split(',');

            if (str[0] == "Command")
            {
                var temp = 0;
                foreach (var itemroom in roomList)
                {
                    if (itemroom.Command == str[1])
                    {
                        temp++;
                        //person = new personList();
                        //person.NickName = session.SessionID;
                        //person.ImageUrl = GetSessionName(session);
                        ////加入到房间中
                        //itemroom.Personlist.Add(person);

                        //Console.WriteLine("输入口令后加入的person：" + person.NickName);
                        //break;
                    }
                }
                if (temp == 0)
                {
                    msg = "4";
                    SendToUser(session.SessionID, msg);
                }
                else {
                    msg = "access";
                    Console.WriteLine("这是直接输入口令加入的用户操作！");
                    SendToUser(session.SessionID, msg);
                }

            }
            //找到当前的用户
            else if (str[0] == "temphorse") {
                msg = "temphorse/";
                msg += session.SessionID;
                SendToUser(session.SessionID, msg);
            }
            //有新用户连接Socket产生会话
            else if (str[0] == "Open")
            {
                //构造'0+'字符串来标识Open状态
                msg = "0/";

                int num = roomList.Count();//是否有房间
                int temp = 0;//是否有该房

                if (num != 0)
                {
                    foreach (var itemroom in roomList)
                    {
                        if (itemroom.Command == str[1])
                        {
                            temp++;
                            if (itemroom.IsBegin != "true")
                            {

                                //新增一个用户
                                person = new personList();
                                person.NickName = session.SessionID;
                                person.ImageUrl = GetSessionName(session);
                                Console.WriteLine("Open状态加入了用户");
                                //加入到房间中
                                itemroom.Personlist.Add(person);
                            }

                        }
                    }
                    if (temp == 0)
                    {
                        //实例化一个用户
                        person = new personList();
                        person.NickName = session.SessionID;
                        person.ImageUrl = GetSessionName(session);
                        //新增一个房间
                        room = new roomList();
                        room.Command = str[1];
                        room.Personlist = new List<personList>();
                        Console.WriteLine("房间模型中没有该房间room.Commmond=" + room.Command);
                        //将人员和房间加入List
                        room.Personlist.Add(person);
                        roomList.Add(room);
                    }
                }
                else {
                    //实例化一个用户
                    person = new personList();
                    person.NickName = session.SessionID;
                    person.ImageUrl = GetSessionName(session);

                    //新增一个房间
                    room = new roomList();
                    room.Personlist = new List<personList>();
                    room.Command = str[1];
                    Console.WriteLine("房间模型中压根没有房间room.Commmond=" + room.Command);
                    //将人员和房间加入List
                    room.Personlist.Add(person);
                    roomList.Add(room);
                }

                //检查房间口令数据
                foreach (var itemroom in roomList)
                {
                    Console.WriteLine("Commond=" + itemroom.Command);
                    //通过房间及人员信息构造msg
                    if (itemroom.Command == str[1])
                    {
                        if (itemroom.IsBegin != "true")
                        {
                            foreach (var itemperson in itemroom.Personlist)
                            {
                                Console.WriteLine("personItem:" + itemperson.NickName);
                                //构造该房间人员信息msg
                                msg += itemperson.NickName;
                                msg += "/";
                            }
                            foreach (var itemperson in itemroom.Personlist)
                            {
                                SendToUser(itemperson.NickName, msg);
                            }
                        }

                    }
                }

                //SendToAll(session, msg); 

            }
            //开赛信息
            //var msg = string.Format("{0:HH:MM:ss} {1}说: {2}", DateTime.Now, GetSessionName(session), value);
            else if (str[0] == "BeginGame")
            {

                msg = "2/" + session.SessionID + "/";
                foreach (var itemroom in roomList)
                {
                    if (itemroom.Command == str[1])
                    {
                        itemroom.IsBegin = "true";
                        foreach (var itemperson in itemroom.Personlist)
                        {
                            msg += itemperson.NickName + "/";
                            Console.WriteLine("开赛人员：" + itemperson.NickName);
                        }
                        msg += str[2];
                        foreach (var itemperson in itemroom.Personlist)
                        {
                            SendToUser(itemperson.NickName, msg);
                        }
                    }
                }
            }
            //房间号信息
            else if (str[0] == "Move")
            {
                msg = "3/";
                foreach (var itemroom in roomList)
                {
                    foreach (var itemperson in itemroom.Personlist)
                    {
                        if (itemperson.NickName == session.SessionID)
                        {
                            msg += itemperson.NickName;
                        }
                    }
                    foreach (var itemperson in itemroom.Personlist)
                    {
                        SendToUser(itemperson.NickName, msg);
                    }
                }
                //SendToAll(session, msg);

            }
            else if (str[0] == "Rank")
            {
                msg = "4/";
                SendToUser(str[1], msg);
            }


        }
        /// <summary>
        /// 启动服务
        /// </summary>
        /// <returns></returns>
        public void Start()
        {
            if (!ws.Setup(ip, port))
            {
                Console.WriteLine("ChatWebSocket 设置WebSocket服务侦听地址失败");
                return;
            }

            if (!ws.Start())
            {
                Console.WriteLine("GameWebSocket 启动WebSocket服务侦听失败");
                return;
            }

            Console.WriteLine("GameWebSocket 启动服务成功");
        }

        /// <summary>
        /// 停止侦听服务
        /// </summary>
        public void Stop()
        {

            if (ws != null)
            {
                ws.Stop();
            }
        }

        private string GetSessionName(WebSocketSession session)
        {
            return HttpUtility.UrlDecode(session.Path.TrimStart('/'));
        }

        private void SendToAll(WebSocketSession session, string msg)
        {
            //广播
            foreach (var sendSession in session.AppServer.GetAllSessions())
            {
                sendSession.Send(msg);
            }
        }
        private void SendToUser(string sessionID,string msg)
        {
            var conn = ws.GetAppSessionByID(sessionID);
            conn.Send(msg);
        }
    }
}
