using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HorseNew.Models
{
    public class personList
    {
        private string nickName;//用户昵称
        private string imageUrl;//用户头像
        private string commNum;//携带口令

        public string NickName
        {
            get
            {
                return nickName;
            }

            set 
            {
                nickName = value;
            }
        }

        public string ImageUrl
        {
            get
            {
                return imageUrl;
            }

            set
            {
                imageUrl = value;
            }
        }

        public string CommNum
        {
            get
            {
                return commNum;
            }

            set
            {
                commNum = value;
            }
        }

        public static implicit operator personList(List<personList> v)
        {
            throw new NotImplementedException();
        }

        public static implicit operator List<object>(personList v)
        {
            throw new NotImplementedException();
        }

        public void Remove(personList itemperson)
        {
            throw new NotImplementedException();
        }
    }
}