import maps from 'qqmap'
export function TMap() {
      return new Promise(resolve => {
            maps.init("TPGBZ-Y24WR-6YFWV-WSUYA-XZBX6-ZHFJQ", () => {
                  resolve(maps);
            });
      });
}