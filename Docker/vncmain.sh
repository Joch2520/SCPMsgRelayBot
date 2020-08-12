#!/bin/bash
# Set them to empty is NOT SECURE but avoid them display in random logs.
export VNC_PASSWD=''
export USER_PASSWD=''

export TERM=linux
export LC_CTYPE=zh_CN.UTF-8
export WINEDEBUG=-all

cqexe=$(basename $(find ~/coolq -maxdepth 1 -type f -name '*.exe' | head -n 1))
mrbjs='~/mrb/src/master.js'
bhljs='~/mrb/src/extras/BHL.js'

while true; do
    echo "[BHLDaemon] Starting BanHammerLite ...."
    cd ~/mrb/src/extras
    sudo node BHL.js &
    echo "[BHLDaemon] Started BanHammerLite."
    wait $!
    echo "[BHLDaemon] BanHammerLite exited."
    echo "[BHLDaemon] Searching for the new process ..."
    sleep 3
    bhlpid=$(ps x | grep -v grep | grep /$bhljs | head -n 1 | awk '{print $1}')
    if [ "$bhlpid" == "" ]; then
        echo "[BHLDaemon] No BanHammerLite process found, start new process ..."
    else
        echo "[BHLDaemon] Found BanHammerLite process, it's okay."
        tail -f /dev/null --pid=$bhlpid
    fi
    echo "[BHLDaemon] BanHammerLite exited. BanHammerLite will start after 3 seconds ..."
    sleep 3
done &
while true; do
    echo "[MRBDaemon] Starting MessageRelayBot ...."
    cd ~/mrb/src
    sudo node master.js &
    echo "[MRBDaemon] Started MessageRelayBot."
    wait $!
    echo "[MRBDaemon] MessageRelayBot exited."
    echo "[MRBDaemon] Searching for the new process ..."
    sleep 3
    mrbpid=$(ps x | grep -v grep | grep /$mrbjs | head -n 1 | awk '{print $1}')
    if [ "$mrbpid" == "" ]; then
        echo "[MRBDaemon] No MessageRelayBot process found, start new process ..."
    else
        echo "[MRBDaemon] Found MessageRelayBot process, it's okay."
        tail -f /dev/null --pid=$mrbpid
    fi
    echo "[MRBDaemon] MessageRelayBot exited. MessageRelayBot will start after 3 seconds ..."
    sleep 3
done &
while true; do
    echo "[CQDaemon] Starting CoolQ ...."
    wine ~/coolq/$cqexe /account $COOLQ_ACCOUNT &
    echo "[CQDaemon] Started CoolQ ."
    wait $!
    echo "[CQDaemon] CoolQ exited, maybe updated."
    echo "[CQDaemon] Searching for the new process ..."
    sleep 3
    cqpid=$(ps x | grep -v grep | grep /$cqexe | head -n 1 | awk '{print $1}')
    if [ "$cqpid" == "" ]; then
        echo "[CQDaemon] No CoolQ process found, start new process ..."
    else
        echo "[CQDaemon] Found CoolQ process, it's okay."
        tail -f /dev/null --pid=$cqpid
    fi
    # 酷Q 退出后直接重启 wine，然后重开。
    # 因为酷Q 更新之类的会自己开回来，所以把整个 wine 干掉重启，比较靠谱
    echo "[CQDaemon] CoolQ exited. Killing wine ..."
    sleep 1
    wine wineboot --kill
    wineserver -k9
    echo "[CQDaemon] CoolQ will start after 3 seconds ..."
    sleep 3
done