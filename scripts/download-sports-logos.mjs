import { writeFileSync, mkdirSync, createWriteStream } from 'fs';
import { get } from 'https';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

function espn(league, abbrev) {
  return `https://a.espncdn.com/i/teamlogos/${league}/500/${abbrev}.png`;
}

const LEAGUES = {
  nba: [
    { code: 'nba-atl', name: 'Atlanta Hawks',            url: espn('nba', 'atl') },
    { code: 'nba-bos', name: 'Boston Celtics',           url: espn('nba', 'bos') },
    { code: 'nba-bkn', name: 'Brooklyn Nets',            url: espn('nba', 'bkn') },
    { code: 'nba-cha', name: 'Charlotte Hornets',        url: espn('nba', 'cha') },
    { code: 'nba-chi', name: 'Chicago Bulls',            url: espn('nba', 'chi') },
    { code: 'nba-cle', name: 'Cleveland Cavaliers',      url: espn('nba', 'cle') },
    { code: 'nba-dal', name: 'Dallas Mavericks',         url: espn('nba', 'dal') },
    { code: 'nba-den', name: 'Denver Nuggets',           url: espn('nba', 'den') },
    { code: 'nba-det', name: 'Detroit Pistons',          url: espn('nba', 'det') },
    { code: 'nba-gsw', name: 'Golden State Warriors',    url: espn('nba', 'gs') },
    { code: 'nba-hou', name: 'Houston Rockets',          url: espn('nba', 'hou') },
    { code: 'nba-ind', name: 'Indiana Pacers',           url: espn('nba', 'ind') },
    { code: 'nba-lac', name: 'LA Clippers',              url: espn('nba', 'lac') },
    { code: 'nba-lal', name: 'Los Angeles Lakers',       url: espn('nba', 'lal') },
    { code: 'nba-mem', name: 'Memphis Grizzlies',        url: espn('nba', 'mem') },
    { code: 'nba-mia', name: 'Miami Heat',               url: espn('nba', 'mia') },
    { code: 'nba-mil', name: 'Milwaukee Bucks',          url: espn('nba', 'mil') },
    { code: 'nba-min', name: 'Minnesota Timberwolves',   url: espn('nba', 'min') },
    { code: 'nba-nop', name: 'New Orleans Pelicans',     url: espn('nba', 'no') },
    { code: 'nba-nyk', name: 'New York Knicks',          url: espn('nba', 'ny') },
    { code: 'nba-okc', name: 'Oklahoma City Thunder',    url: espn('nba', 'okc') },
    { code: 'nba-orl', name: 'Orlando Magic',            url: espn('nba', 'orl') },
    { code: 'nba-phi', name: 'Philadelphia 76ers',       url: espn('nba', 'phi') },
    { code: 'nba-phx', name: 'Phoenix Suns',             url: espn('nba', 'phx') },
    { code: 'nba-por', name: 'Portland Trail Blazers',   url: espn('nba', 'por') },
    { code: 'nba-sac', name: 'Sacramento Kings',         url: espn('nba', 'sac') },
    { code: 'nba-sas', name: 'San Antonio Spurs',        url: espn('nba', 'sa') },
    { code: 'nba-tor', name: 'Toronto Raptors',          url: espn('nba', 'tor') },
    { code: 'nba-uta', name: 'Utah Jazz',                url: espn('nba', 'utah') },
    { code: 'nba-wsh', name: 'Washington Wizards',       url: espn('nba', 'wsh') },
  ],
  nhl: [
    { code: 'nhl-ana', name: 'Anaheim Ducks',            url: espn('nhl', 'ana') },
    { code: 'nhl-bos', name: 'Boston Bruins',            url: espn('nhl', 'bos') },
    { code: 'nhl-buf', name: 'Buffalo Sabres',           url: espn('nhl', 'buf') },
    { code: 'nhl-cgy', name: 'Calgary Flames',           url: espn('nhl', 'cgy') },
    { code: 'nhl-car', name: 'Carolina Hurricanes',      url: espn('nhl', 'car') },
    { code: 'nhl-chi', name: 'Chicago Blackhawks',       url: espn('nhl', 'chi') },
    { code: 'nhl-col', name: 'Colorado Avalanche',       url: espn('nhl', 'col') },
    { code: 'nhl-cbj', name: 'Columbus Blue Jackets',    url: espn('nhl', 'cbj') },
    { code: 'nhl-dal', name: 'Dallas Stars',             url: espn('nhl', 'dal') },
    { code: 'nhl-det', name: 'Detroit Red Wings',        url: espn('nhl', 'det') },
    { code: 'nhl-edm', name: 'Edmonton Oilers',          url: espn('nhl', 'edm') },
    { code: 'nhl-fla', name: 'Florida Panthers',         url: espn('nhl', 'fla') },
    { code: 'nhl-lak', name: 'Los Angeles Kings',        url: espn('nhl', 'lak') },
    { code: 'nhl-min', name: 'Minnesota Wild',           url: espn('nhl', 'min') },
    { code: 'nhl-mtl', name: 'Montreal Canadiens',       url: espn('nhl', 'mtl') },
    { code: 'nhl-nsh', name: 'Nashville Predators',      url: espn('nhl', 'nsh') },
    { code: 'nhl-njd', name: 'New Jersey Devils',        url: espn('nhl', 'nj') },
    { code: 'nhl-nyi', name: 'New York Islanders',       url: espn('nhl', 'nyi') },
    { code: 'nhl-nyr', name: 'New York Rangers',         url: espn('nhl', 'nyr') },
    { code: 'nhl-ott', name: 'Ottawa Senators',          url: espn('nhl', 'ott') },
    { code: 'nhl-phi', name: 'Philadelphia Flyers',      url: espn('nhl', 'phi') },
    { code: 'nhl-pit', name: 'Pittsburgh Penguins',      url: espn('nhl', 'pit') },
    { code: 'nhl-stl', name: 'St. Louis Blues',          url: espn('nhl', 'stl') },
    { code: 'nhl-sjs', name: 'San Jose Sharks',          url: espn('nhl', 'sj') },
    { code: 'nhl-sea', name: 'Seattle Kraken',           url: espn('nhl', 'sea') },
    { code: 'nhl-tbl', name: 'Tampa Bay Lightning',      url: espn('nhl', 'tb') },
    { code: 'nhl-tor', name: 'Toronto Maple Leafs',      url: espn('nhl', 'tor') },
    { code: 'nhl-uta', name: 'Utah Hockey Club',         url: espn('nhl', 'utah') },
    { code: 'nhl-van', name: 'Vancouver Canucks',        url: espn('nhl', 'van') },
    { code: 'nhl-vgk', name: 'Vegas Golden Knights',     url: espn('nhl', 'vgk') },
    { code: 'nhl-wsh', name: 'Washington Capitals',      url: espn('nhl', 'wsh') },
    { code: 'nhl-wpg', name: 'Winnipeg Jets',            url: espn('nhl', 'wpg') },
  ],
  mlb: [
    { code: 'mlb-ari', name: 'Arizona Diamondbacks',     url: espn('mlb', 'ari') },
    { code: 'mlb-atl', name: 'Atlanta Braves',           url: espn('mlb', 'atl') },
    { code: 'mlb-bal', name: 'Baltimore Orioles',        url: espn('mlb', 'bal') },
    { code: 'mlb-bos', name: 'Boston Red Sox',           url: espn('mlb', 'bos') },
    { code: 'mlb-chc', name: 'Chicago Cubs',             url: espn('mlb', 'chc') },
    { code: 'mlb-cws', name: 'Chicago White Sox',        url: espn('mlb', 'cws') },
    { code: 'mlb-cin', name: 'Cincinnati Reds',          url: espn('mlb', 'cin') },
    { code: 'mlb-cle', name: 'Cleveland Guardians',      url: espn('mlb', 'cle') },
    { code: 'mlb-col', name: 'Colorado Rockies',         url: espn('mlb', 'col') },
    { code: 'mlb-det', name: 'Detroit Tigers',           url: espn('mlb', 'det') },
    { code: 'mlb-hou', name: 'Houston Astros',           url: espn('mlb', 'hou') },
    { code: 'mlb-kc',  name: 'Kansas City Royals',       url: espn('mlb', 'kc') },
    { code: 'mlb-laa', name: 'Los Angeles Angels',       url: espn('mlb', 'laa') },
    { code: 'mlb-lad', name: 'Los Angeles Dodgers',      url: espn('mlb', 'lad') },
    { code: 'mlb-mia', name: 'Miami Marlins',            url: espn('mlb', 'mia') },
    { code: 'mlb-mil', name: 'Milwaukee Brewers',        url: espn('mlb', 'mil') },
    { code: 'mlb-min', name: 'Minnesota Twins',          url: espn('mlb', 'min') },
    { code: 'mlb-nym', name: 'New York Mets',            url: espn('mlb', 'nym') },
    { code: 'mlb-nyy', name: 'New York Yankees',         url: espn('mlb', 'nyy') },
    { code: 'mlb-oak', name: 'Oakland Athletics',        url: espn('mlb', 'oak') },
    { code: 'mlb-phi', name: 'Philadelphia Phillies',    url: espn('mlb', 'phi') },
    { code: 'mlb-pit', name: 'Pittsburgh Pirates',       url: espn('mlb', 'pit') },
    { code: 'mlb-sd',  name: 'San Diego Padres',         url: espn('mlb', 'sd') },
    { code: 'mlb-sf',  name: 'San Francisco Giants',     url: espn('mlb', 'sf') },
    { code: 'mlb-sea', name: 'Seattle Mariners',         url: espn('mlb', 'sea') },
    { code: 'mlb-stl', name: 'St. Louis Cardinals',      url: espn('mlb', 'stl') },
    { code: 'mlb-tb',  name: 'Tampa Bay Rays',           url: espn('mlb', 'tb') },
    { code: 'mlb-tex', name: 'Texas Rangers',            url: espn('mlb', 'tex') },
    { code: 'mlb-tor', name: 'Toronto Blue Jays',        url: espn('mlb', 'tor') },
    { code: 'mlb-wsh', name: 'Washington Nationals',     url: espn('mlb', 'wsh') },
  ],
  nfl: [
    { code: 'nfl-ari', name: 'Arizona Cardinals',        url: espn('nfl', 'ari') },
    { code: 'nfl-atl', name: 'Atlanta Falcons',          url: espn('nfl', 'atl') },
    { code: 'nfl-bal', name: 'Baltimore Ravens',         url: espn('nfl', 'bal') },
    { code: 'nfl-buf', name: 'Buffalo Bills',            url: espn('nfl', 'buf') },
    { code: 'nfl-car', name: 'Carolina Panthers',        url: espn('nfl', 'car') },
    { code: 'nfl-chi', name: 'Chicago Bears',            url: espn('nfl', 'chi') },
    { code: 'nfl-cin', name: 'Cincinnati Bengals',       url: espn('nfl', 'cin') },
    { code: 'nfl-cle', name: 'Cleveland Browns',         url: espn('nfl', 'cle') },
    { code: 'nfl-dal', name: 'Dallas Cowboys',           url: espn('nfl', 'dal') },
    { code: 'nfl-den', name: 'Denver Broncos',           url: espn('nfl', 'den') },
    { code: 'nfl-det', name: 'Detroit Lions',            url: espn('nfl', 'det') },
    { code: 'nfl-gb',  name: 'Green Bay Packers',        url: espn('nfl', 'gb') },
    { code: 'nfl-hou', name: 'Houston Texans',           url: espn('nfl', 'hou') },
    { code: 'nfl-ind', name: 'Indianapolis Colts',       url: espn('nfl', 'ind') },
    { code: 'nfl-jax', name: 'Jacksonville Jaguars',     url: espn('nfl', 'jax') },
    { code: 'nfl-kc',  name: 'Kansas City Chiefs',       url: espn('nfl', 'kc') },
    { code: 'nfl-lac', name: 'Los Angeles Chargers',     url: espn('nfl', 'lac') },
    { code: 'nfl-lar', name: 'Los Angeles Rams',         url: espn('nfl', 'lar') },
    { code: 'nfl-lv',  name: 'Las Vegas Raiders',        url: espn('nfl', 'lv') },
    { code: 'nfl-mia', name: 'Miami Dolphins',           url: espn('nfl', 'mia') },
    { code: 'nfl-min', name: 'Minnesota Vikings',        url: espn('nfl', 'min') },
    { code: 'nfl-ne',  name: 'New England Patriots',     url: espn('nfl', 'ne') },
    { code: 'nfl-no',  name: 'New Orleans Saints',       url: espn('nfl', 'no') },
    { code: 'nfl-nyg', name: 'New York Giants',          url: espn('nfl', 'nyg') },
    { code: 'nfl-nyj', name: 'New York Jets',            url: espn('nfl', 'nyj') },
    { code: 'nfl-phi', name: 'Philadelphia Eagles',      url: espn('nfl', 'phi') },
    { code: 'nfl-pit', name: 'Pittsburgh Steelers',      url: espn('nfl', 'pit') },
    { code: 'nfl-sea', name: 'Seattle Seahawks',         url: espn('nfl', 'sea') },
    { code: 'nfl-sf',  name: 'San Francisco 49ers',      url: espn('nfl', 'sf') },
    { code: 'nfl-tb',  name: 'Tampa Bay Buccaneers',     url: espn('nfl', 'tb') },
    { code: 'nfl-ten', name: 'Tennessee Titans',         url: espn('nfl', 'ten') },
    { code: 'nfl-wsh', name: 'Washington Commanders',    url: espn('nfl', 'wsh') },
  ],
};

for (const [league, teams] of Object.entries(LEAGUES)) {
  const outDir = join(root, `public/images/${league}-teams`);
  mkdirSync(outDir, { recursive: true });
  console.log(`\n--- ${league.toUpperCase()} ---`);

  const result = [];
  for (const team of teams) {
    const dest = join(outDir, `${team.code}.png`);
    process.stdout.write(`  ${team.name}... `);
    try {
      await download(team.url, dest);
      console.log('ok');
      result.push({ code: team.code, name: team.name, emoji: '', imageUrl: `/images/${league}-teams/${team.code}.png` });
    } catch (err) {
      console.log(`FAILED: ${err.message} (${team.url})`);
      result.push({ code: team.code, name: team.name, emoji: '', imageUrl: team.url });
    }
  }

  writeFileSync(join(root, `src/data/${league}-teams.json`), JSON.stringify(result, null, 2) + '\n');
}

console.log('\nAll done.');
