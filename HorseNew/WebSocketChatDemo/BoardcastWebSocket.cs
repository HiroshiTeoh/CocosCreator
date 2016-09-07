using System;
using System.Threading;
using SuperWebSocket;

namespace WebSocketChatDemo
{
    /// <summary>
    /// 服务端向客户端进行广播
    /// </summary>
    public class BoardcastWebSocket
    {
        private const string ip = "127.0.0.1";
        private const int port = 2013;
        private WebSocketServer ws = null;//SuperWebSocket中的WebSocketServer对象
        private Timer timer = null;


        public BoardcastWebSocket()
        {
            ws = new WebSocketServer();//实例化WebSocketServer

            //添加事件侦听
            ws.NewSessionConnected += ws_NewSessionConnected;//有新会话握手并连接成功
            ws.SessionClosed += ws_SessionClosed;//有会话被关闭 可能是服务端关闭 也可能是客户端关闭
        }

        void ws_NewSessionConnected(WebSocketSession session)
        {
            Console.WriteLine("{0:HH:MM:ss}  与客户端:{1}创建新会话", DateTime.Now, session.RemoteEndPoint);
        }

        void ws_SessionClosed(WebSocketSession session, SuperSocket.SocketBase.CloseReason value)
        {
            Console.WriteLine("{0:HH:MM:ss}  与客户端:{1}的会话被关闭 原因：{2}", DateTime.Now, session.RemoteEndPoint, value);
        }


        /// <summary>
        /// 启动服务
        /// </summary>
        /// <returns></returns>
        public void Start()
        {
            if (!ws.Setup(ip, port))
            {
                Console.WriteLine("BoardCastWebSocket 设置WebSocket服务侦听地址失败");
                return;
            }

            if (!ws.Start())
            {
                Console.WriteLine("BoardCastWebSocket 启动WebSocket服务侦听失败");
                return;
            }

            Console.WriteLine("BoardCastWebSocket 启动服务成功");

            timer = new Timer((data) =>
            {
                var msg = string.Format("服务器当前时间：{0:HH:MM:ss}", DateTime.Now);

                //对当前已连接的所有会话进行广播
                foreach (var session in ws.GetAllSessions())
                {
                    session.Send(msg);
                }

            }, null, 1000, 1000);


         
        }

        /// <summary>
        /// 停止侦听服务
        /// </summary>
        public void Stop()
        {
            if (timer != null)
            {
                timer.Dispose();
            }
            if (ws != null)
            {
                ws.Stop();
            }
        }
    }
}
