using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using SuperSocket.SocketBase;
using SuperWebSocket;
using SuperWebSocket.SubProtocol;

namespace WebSocketChatDemo
{
     public class study1
    {
        private const string ip = "127.0.0.1";
        private const int port = 2015;
        private WebSocketServer ws = null;//SuperWebSocket中的WebSocketServer对象
        public study1()
        {
            ws = new WebSocketServer();//实例化WebSocketServer

            //添加事件侦听
            ws.NewSessionConnected += ws_NewSessionConnected;//有新会话握手并连接成功
            ws.SessionClosed += ws_SessionClosed;//有会话被关闭 可能是服务端关闭 也可能是客户端关闭
           // ws.NewMessageReceived += ws_NewMessageReceived;//有客户端发送新的消息
        }

        private void ws_NewMessageReceived(WebSocketSession session, string value)
        {
            //throw new NotImplementedException();
            var msg = string.Format("{0:HH:MM:ss} {1}说: {2}", DateTime.Now, session.RemoteEndPoint, value);

            SendToAll(session, msg);
        }

        private void ws_SessionClosed(WebSocketSession session, CloseReason value)
        {
            // throw new NotImplementedException();
            Console.WriteLine("{0:HH:MM:ss}  与客户端:{1}的会话被关闭 原因：{2}", DateTime.Now, session.RemoteEndPoint, value);
            var msg = string.Format("{0:HH:MM:ss} {1} 离开聊天室", DateTime.Now, session.RemoteEndPoint);
            SendToAll(session, msg);

        }

        private void ws_NewSessionConnected(WebSocketSession session)
        {
            // throw new NotImplementedException();
           
            Console.WriteLine("{0:HH:MM:ss}  与客户端:{1}创建新会话", DateTime.Now, session.RemoteEndPoint);
            var msg = string.Format("{0:HH:MM:ss} {1} 进入聊天室", DateTime.Now, session.RemoteEndPoint);
            SendToAll(session, msg);
        }

        /// <summary>
        /// 启动服务
        /// </summary>
        /// <returns></returns>
        public void Start()
        {
            if (!ws.Setup(ip, port))
            {
                Console.WriteLine("StudyWebSocket 设置WebSocket服务侦听地址失败");
                return;
            }

            if (!ws.Start())
            {
                Console.WriteLine("StudyWebSocket 启动WebSocket服务侦听失败");
                return;
            }

            Console.WriteLine("StudyWebSocket 启动服务成功");



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

        private void SendToAll(WebSocketSession session, string msg)
        {
            //广播
            foreach (var sendSession in session.AppServer.GetAllSessions())
            {
                sendSession.Send(msg);
            }
        }
    }

    public class ADD : SubCommandBase
    {
        public override void ExecuteCommand(WebSocketSession session, SubRequestInfo requestInfo)
        {
            var paramArray = requestInfo.Body.Split(' ');

            session.Send((int.Parse(paramArray[0]) + int.Parse(paramArray[1])).ToString());
        }
    }

}
