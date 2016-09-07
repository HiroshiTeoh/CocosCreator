using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HorseNew.Models
{
    public class roomList
    {
        private string isBegin;//房间是否已开赛
        private string command;//房间口令
        private List<personList> personlist;//房间中的人员

        public string Command
        {
            get
            {
                return command;
            }

            set
            {
                this.command = value;
            }
        }

        public List<personList> Personlist
        {
            get
            {
                return personlist;
            }

            set
            {
                personlist = value;
            }
        }

        public string IsBegin
        {
            get
            {
                return isBegin;
            }

            set
            {
                isBegin = value;
            }
        }
    }
}