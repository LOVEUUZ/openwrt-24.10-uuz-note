#include <stdio.h>
#include "myubus_dbg_test.h"


void myubus_log(const char *msg)
{
    syslog(LOG_DEBUG, "myubus_log exec %s", msg);

    int a,b,c;
    a = 1;
    b = 2;
    c = a + b;
    syslog(LOG_DEBUG, "c =  %d", c);
}