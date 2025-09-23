import bcrypt from 'bcryptjs';

// Common weak passwords to deny (top 1000+ common passwords)
export const COMMON_WEAK_PASSWORDS = new Set([
  '123456', 'password', '123456789', '12345678', '12345', '1234567', '1234567890',
  'qwerty', 'abc123', '111111', 'password1', 'password123', 'admin', 'root', 'welcome',
  'login', 'letmein', 'dragon', 'master', 'monkey', 'mustang', 'shadow', 'sunshine',
  'football', 'passw0rd', 'freedom', 'whatever', 'princess', 'solo', 'green', 'qazwsx',
  'starwars', 'trustno1', 'michael', 'jennifer', 'bailey', 'amanda', 'buster', 'hockey',
  'pepper', 'austin', 'tigger', 'thomas', 'pookie', 'charlie', 'hunter', 'chelsea',
  'george', 'samantha', 'cookie', 'ashley', 'ginger', 'matthew', 'michelle', 'danielle',
  'diamond', 'yellow', 'babygirl', 'bigdog', 'gateway', 'cheese', 'liverpool', 'scooter',
  'ranger', 'anthony', 'gfhjkm', 'maverick', 'dakota', 'cowboy', 'player', 'summer',
  'computer', 'corvette', 'hello', 'apples', 'testing', 'ncc1701', 'secret', 'falcon',
  'midnight', 'purple', 'mercedes', 'junior', 'internet', 'alexander', 'creative',
  'florida', 'snoopy', 'miller', 'welcome1', 'jasmine', 'andrew', 'redsox', 'peanut',
  'turtle', 'orange', 'banana', 'martin', 'chicago', 'august', 'apple', 'maggie',
  'chance', 'michigan', 'carlos', 'boomer', 'yankees', 'silver', 'warrior', 'phoenix',
  'angels', 'giants', 'rangers', 'pamela', 'parker', 'matrix', 'madison', 'monica',
  'money', 'cowboys', 'knicks', 'gators', 'spider', 'rabbit', 'arsenal', 'eagles',
  'raiders', 'winner', 'rachel', 'victoria', 'thx1138', 'jasper', 'heather', 'angela',
  'gandalf', 'winter', 'hammer', 'cooper', 'america', 'albert', '7777777', 'winner',
  'sophie', 'please', 'jackie', 'boston', 'calvin', 'tigers', 'marine', 'ravens',
  'enigma', 'rachel', 'compaq', '12345678910', '12345678901234567890', 'iloveyou',
  'princess1', '55555', '00000', 'aaaaa', 'zzzzz', 'qwerty123', '1q2w3e', '1q2w3e4r',
  '1q2w3e4r5t', '1qaz2wsx', 'qwer1234', 'abcd1234', 'password12', '1234abcd',
  'sunshine1', 'football1', 'admin123', 'welcome123', 'master123', 'monkey123',
  'dragon123', 'shadow123', 'michael1', 'michelle1', 'jennifer1', 'princess12',
  'jordan23', 'qwerty12', 'buster123', 'hunter123', 'thomas123', 'charlie123',
  'superman1', 'batman123', 'spiderman', 'harrypotter', 'starwars123', 'marvel123',
  'justice123', 'avengers123', 'wolverine', 'xmen123', 'matrix123', 'terminator',
  'predator123', 'alien123', 'predator', 'terminator123', 'halloween', 'friday13th',
  'hockey123', 'rangers123', 'rangers1', 'yankees123', 'yankees1', 'giants123',
  'giants1', 'eagles123', 'eagles1', 'cowboys123', 'cowboys1', 'raiders123',
  'raiders1', 'warriors123', 'lakers123', 'lakers1', 'celtics123', 'bulls123',
  'bulls1', 'knicks123', 'knicks1', 'nets123', 'nets1', 'heat123', 'heat1',
  'mavericks123', 'spurs123', 'spurs1', 'rockets123', 'rockets1', 'clippers123',
  'clippers1', 'kings123', 'kings1', 'blazers123', 'blazers1', 'jazz123', 'jazz1',
  'suns123', 'suns1', 'warriors1', 'mavs123', 'mavs1', 'nuggets123', 'nuggets1',
  'thunder123', 'thunder1', 'blazers', 'timberwolves', 'timberwolves123', 'timberwolves1',
  'pelicans123', 'pelicans1', 'grizzlies123', 'grizzlies1', 'spurs', 'mavericks',
  'rockets', 'clippers', 'lakers', 'warriors', 'suns', 'jazz', 'kings', 'nuggets',
  'thunder', 'blazers', 'timberwolves', 'pelicans', 'grizzlies', 'celtics', 'nets',
  'heat', 'bulls', 'knicks', 'magic', 'wizards', 'hawks', 'hornets', 'pistons',
  'cavaliers', 'pacers', 'bucks', 'raptors', 'sixers', 'nets', 'magic123', 'magic1',
  'wizards123', 'wizards1', 'hawks123', 'hawks1', 'hornets123', 'hornets1', 'pistons123',
  'pistons1', 'cavaliers123', 'cavaliers1', 'pacers123', 'pacers1', 'bucks123', 'bucks1',
  'raptors123', 'raptors1', 'sixers123', 'sixers1', 'nets123', 'nets1', 'magic123',
  'wizards123', 'hawks123', 'hornets123', 'pistons123', 'cavaliers123', 'pacers123',
  'bucks123', 'raptors123', 'sixers123', 'nets123',
  // Additional common passwords from the fetched list
  'pussy', 'baseball', 'football', 'letmein', 'monkey', '696969', 'abc123', 'mustang',
  'michael', 'shadow', 'master', 'jennifer', '111111', '2000', 'jordan', 'superman',
  'harley', '1234567', 'fuckme', 'hunter', 'fuckyou', 'trustno1', 'ranger', 'buster',
  'thomas', 'tigger', 'robert', 'soccer', 'fuck', 'batman', 'test', 'pass', 'killer',
  'hockey', 'george', 'charlie', 'andrew', 'michelle', 'love', 'sunshine', 'jessica',
  'asshole', '6969', 'pepper', 'daniel', 'access', '123456789', '654321', 'joshua',
  'maggie', 'starwars', 'silver', 'william', 'dallas', 'yankees', '123123', 'ashley',
  '666666', 'hello', 'amanda', 'orange', 'biteme', 'freedom', 'computer', 'sexy',
  'thunder', 'nicole', 'ginger', 'heather', 'hammer', 'summer', 'corvette', 'taylor',
  'fucker', 'austin', '1111', 'merlin', 'matthew', '121212', 'golfer', 'cheese',
  'princess', 'martin', 'chelsea', 'patrick', 'richard', 'diamond', 'yellow', 'bigdog',
  'secret', 'asdfgh', 'sparky', 'cowboy', 'camaro', 'anthony', 'matrix', 'falcon',
  'iloveyou', 'bailey', 'guitar', 'jackson', 'purple', 'scooter', 'phoenix', 'aaaaaa',
  'morgan', 'tigers', 'porsche', 'mickey', 'maverick', 'cookie', 'nascar', 'peanut',
  'justin', '131313', 'money', 'horny', 'samantha', 'panties', 'steelers', 'joseph',
  'snoopy', 'boomer', 'whatever', 'iceman', 'smokey', 'gateway', 'dakota', 'cowboys',
  'eagles', 'chicken', 'dick', 'black', 'zxcvbn', 'please', 'andrea', 'ferrari',
  'knight', 'hardcore', 'melissa', 'compaq', 'coffee', 'booboo', 'bitch', 'johnny',
  'bulldog', 'xxxxxx', 'welcome', 'james', 'player', 'ncc1701', 'wizard', 'scooby',
  'charles', 'junior', 'internet', 'bigdick', 'mike', 'brandy', 'tennis', 'blowjob',
  'banana', 'monster', 'spider', 'lakers', 'miller', 'rabbit', 'enter', 'mercedes',
  'brandon', 'steven', 'fender', 'john', 'yamaha', 'diablo', 'chris', 'boston',
  'tiger', 'marine', 'chicago', 'rangers', 'gandalf', 'winter', 'bigtits', 'barney',
  'edward', 'raiders', 'porn', 'badboy', 'blowme', 'spanky', 'bigdaddy', 'johnson',
  'chester', 'london', 'midnight', 'blue', 'fishing', '000000', 'hannah', 'slayer',
  '11111111', 'rachel', 'sexsex', 'redsox', 'thx1138', 'asdf', 'marlboro', 'panther',
  'zxcvbnm', 'arsenal', 'oliver', 'qazwsx', 'mother', 'victoria', '7777777', 'jasper',
  'angel', 'david', 'winner', 'crystal', 'golden', 'butthead', 'viking', 'jack',
  'iwantu', 'shannon', 'murphy', 'angels', 'prince', 'cameron', 'girls', 'madison',
  'wilson', 'carlos', 'hooters', 'willie', 'startrek', 'captain', 'maddog', 'jasmine',
  'butter', 'booger', 'angela', 'golf', 'lauren', 'rocket', 'tiffany', 'theman',
  'dennis', 'liverpoo', 'flower', 'forever', 'green', 'jackie', 'muffin', 'turtle',
  'sophie', 'danielle', 'redskins', 'toyota', 'jason', 'sierra', 'winston', 'debbie',
  'giants', 'packers', 'newyork', 'jeremy', 'casper', 'bubba', '112233', 'sandra',
  'lovers', 'mountain', 'united', 'cooper', 'driver', 'tucker', 'helpme', 'fucking',
  'pookie', 'lucky', 'maxwell', '8675309', 'bear', 'suckit', 'gators', '5150',
  '222222', 'shithead', 'fuckoff', 'jaguar', 'monica', 'fred', 'happy', 'hotdog',
  'tits', 'gemini', 'lover', 'xxxxxxxx', '777777', 'canada', 'nathan', 'victor',
  'florida', '88888888', 'nicholas', 'rosebud', 'metallic', 'doctor', 'trouble',
  'success', 'stupid', 'tomcat', 'warrior', 'peaches', 'apples', 'fish', 'qwertyui',
  'magic', 'buddy', 'dolphins', 'rainbow', 'gunner', '987654', 'freddy', 'alexis',
  'braves', 'cock', '2112', '1212', 'cocacola', 'xavier', 'dolphin', 'testing',
  'bond007', 'member', 'calvin', 'voodoo', '7777', 'samson', 'alex', 'apollo',
  'fire', 'tester', 'walter', 'beavis', 'voyager', 'peter', 'porno', 'bonnie',
  'rush2112', 'beer', 'apple', 'scorpio', 'jonathan', 'skippy', 'sydney', 'scott',
  'red123', 'power', 'gordon', 'travis', 'beaver', 'star', 'jackass', 'flyers',
  'boobs', '232323', 'zzzzzz', 'steve', 'rebecca', 'scorpion', 'doggie', 'legend',
  'ou812', 'yankee', 'blazer', 'bill', 'runner', 'birdie', 'bitches', '555555',
  'parker', 'topgun', 'asdfasdf', 'heaven', 'viper', 'animal', '2222', 'bigboy',
  '4444', 'arthur', 'baby', 'private', 'godzilla', 'donald', 'williams', 'lifehack',
  'phantom', 'dave', 'rock', 'august', 'sammy', 'cool', 'brian', 'platinum', 'jake',
  'bronco', 'paul', 'mark', 'frank', 'heka6w2', 'copper', 'billy', 'cumshot',
  'garfield', 'willow', 'cunt', 'little', 'carter', 'slut', 'albert', '69696969',
  'kitten', 'super', 'jordan23', 'eagle1', 'shelby', 'america', '11111', 'jessie',
  'house', 'free', '123321', 'chevy', 'bullshit', 'white', 'broncos', 'horney',
  'surfer', 'nissan', '999999', 'saturn', 'airborne', 'elephant', 'marvin', 'shit',
  'action', 'adidas', 'qwert', 'kevin', '1313', 'explorer', 'walker', 'police',
  'christin', 'december', 'benjamin', 'wolf', 'sweet', 'therock', 'king', 'online',
  'dickhead', 'brooklyn', 'teresa', 'cricket', 'sharon', 'dexter', 'racing', 'penis',
  'gregory', '0000', 'teens', 'redwings', 'dreams', 'michigan', 'hentai', 'magnum',
  '87654321', 'nothing', 'donkey', 'trinity', 'digital', '333333', 'stella', 'cartman',
  'guinness', '123abc', 'speedy', 'buffalo', 'kitty', 'pimpin', 'eagle', 'einstein',
  'kelly', 'nelson', 'nirvana', 'vampire', 'xxxx', 'playboy', 'louise', 'pumpkin',
  'snowball', 'test123', 'girl', 'sucker', 'mexico', 'beatles', 'fantasy', 'ford',
  'gibson', 'celtic', 'marcus', 'cherry', 'cassie', '888888', 'natasha', 'sniper',
  'chance', 'genesis', 'hotrod', 'reddog', 'alexande', 'college', 'jester', 'passw0rd',
  'bigcock', 'smith', 'lasvegas', 'carmen', 'slipknot', '3333', 'death', 'kimberly',
  '1q2w3e', 'eclipse', '1q2w3e4r', 'stanley', 'samuel', 'drummer', 'homer', 'montana',
  'music', 'aaaa', 'spencer', 'jimmy', 'carolina', 'colorado', 'creative', 'hello1',
  'rocky', 'goober', 'friday', 'bollocks', 'scotty', 'abcdef', 'bubbles', 'hawaii',
  'fluffy', 'mine', 'stephen', 'horses', 'thumper', '5555', 'pussies', 'darkness',
  'asdfghjk', 'pamela', 'boobies', 'buddha', 'vanessa', 'sandman', 'naughty', 'douglas',
  'honda', 'matt', 'azerty', '6666', 'shorty', 'money1', 'beach', 'loveme', '4321',
  'simple', 'poohbear', '444444', 'badass', 'destiny', 'sarah', 'denise', 'vikings',
  'lizard', 'melanie', 'assman', 'sabrina', 'nintendo', 'water', 'good', 'howard',
  'time', '123qwe', 'november', 'xxxxx', 'october', 'leather', 'bastard', 'young',
  '101010', 'extreme', 'hard', 'password1', 'vincent', 'pussy1', 'lacrosse', 'hotmail',
  'spooky', 'amateur', 'alaska', 'badger', 'paradise', 'maryjane', 'poop', 'crazy',
  'mozart', 'video', 'russell', 'vagina', 'spitfire', 'anderson', 'norman', 'eric',
  'cherokee', 'cougar', 'barbara', 'long', '420420', 'family', 'horse', 'enigma',
  'allison', 'raider', 'brazil', 'blonde', 'jones', '55555', 'dude', 'drowssap',
  'jeff', 'school', 'marshall', 'lovely', '1qaz2wsx', 'jeffrey', 'caroline', 'franklin',
  'booty', 'molly', 'snickers', 'leslie', 'nipples', 'courtney', 'diesel', 'rocks',
  'eminem', 'westside', 'suzuki', 'daddy', 'passion', 'hummer', 'ladies', 'zachary',
  'frankie', 'elvis', 'reggie', 'alpha', 'suckme', 'simpson', 'patricia', '147147',
  'pirate', 'tommy', 'semperfi', 'jupiter', 'redrum', 'freeuser', 'wanker', 'stinky',
  'ducati', 'paris', 'natalie', 'babygirl', 'bishop', 'windows', 'spirit', 'pantera',
  'monday', 'patches', 'brutus', 'houston', 'smooth', 'penguin', 'marley', 'forest',
  'cream', '212121', 'flash', 'maximus', 'nipple', 'bobby', 'bradley', 'vision',
  'pokemon', 'champion', 'fireman', 'indian', 'softball', 'picard', 'system', 'clinton',
  'cobra', 'enjoy', 'lucky1', 'claire', 'claudia', 'boogie', 'timothy', 'marines',
  'security', 'dirty', 'admin', 'wildcats', 'pimp', 'dancer', 'hardon', 'veronica',
  'fucked', 'abcd1234', 'abcdefg', 'ironman', 'wolverin', 'remember', 'great',
  'freepass', 'bigred', 'squirt', 'justice', 'francis', 'hobbes', 'kermit', 'pearljam',
  'mercury', 'domino', '9999', 'denver', 'brooke', 'rascal', 'hitman', 'mistress',
  'simon', 'tony', 'bbbbbb', 'friend', 'peekaboo', 'naked', 'budlight', 'electric',
  'sluts', 'stargate', 'saints', 'bondage', 'brittany', 'bigman', 'zombie', 'swimming',
  'duke', 'qwerty1', 'babes', 'scotland', 'disney', 'rooster', 'brenda', 'mookie',
  'swordfis', 'candy', 'duncan', 'olivia', 'hunting', 'blink182', 'alicia', '8888',
  'samsung', 'bubba1', 'whore', 'virginia', 'general', 'passport', 'aaaaaaaa', 'erotic',
  'liberty', 'arizona', 'jesus', 'abcd', 'newport', 'skipper', 'rolltide', 'balls',
  'happy1', 'galore', 'christ', 'weasel', '242424', 'wombat', 'digger', 'classic',
  'bulldogs', 'poopoo', 'accord', 'popcorn', 'turkey', 'jenny', 'amber', 'bunny',
  'mouse', '007007', 'titanic', 'liverpool', 'dreamer', 'everton', 'friends', 'chevelle',
  'carrie', 'gabriel', 'psycho', 'nemesis', 'burton', 'pontiac', 'connor', 'eatme',
  'lickme', 'roland', 'cumming', 'mitchell', 'ireland', 'lincoln', 'arnold', 'spiderma',
  'patriots', 'goblue', 'devils', 'eugene', 'empire', 'asdfg', 'cardinal', 'brown',
  'shaggy', 'froggy', 'qwer', 'kawasaki', 'kodiak', 'people', 'phpbb', 'light',
  '54321', 'kramer', 'chopper', 'hooker', 'honey', 'whynot', 'lesbian', 'lisa',
  'baxter', 'adam', 'snake', 'teen', 'ncc1701d', 'qqqqqq', 'airplane', 'britney',
  'avalon', 'sandy', 'sugar', 'sublime', 'stewart', 'wildcat', 'raven', 'scarface',
  'elizabet', '123654', 'trucks', 'wolfpack', 'pervert', 'lawrence', 'raymond',
  'redhead', 'american', 'alyssa', 'bambam', 'movie', 'woody', 'shaved', 'snowman',
  'tiger1', 'chicks', 'raptor', '1969', 'stingray', 'shooter', 'france', 'stars',
  'madmax', 'kristen', 'sports', 'jerry', '789456', 'garcia', 'simpsons', 'lights',
  'ryan', 'looking', 'chronic', 'alison', 'hahaha', 'packard', 'hendrix', 'perfect',
  'service', 'spring', 'srinivas', 'spike', 'katie', '252525', 'oscar', 'brother',
  'bigmac', 'suck', 'single', 'cannon', 'georgia', 'popeye', 'tattoo', 'texas',
  'party', 'bullet', 'taurus', 'sailor', 'wolves', 'panthers', 'japan', 'strike',
  'flowers', 'pussycat', 'chris1', 'loverboy', 'berlin', 'sticky', 'marina', 'tarheels',
  'fisher', 'russia', 'connie', 'wolfgang', 'testtest', 'mature', 'bass', 'catch22',
  'juice', 'michael1', 'nigger', '159753', 'women', 'alpha1', 'trooper', 'hawkeye',
  'head', 'freaky', 'dodgers', 'pakistan', 'machine', 'pyramid', 'vegeta', 'katana',
  'moose', 'tinker', 'coyote', 'infinity', 'inside', 'pepsi', 'letmein1', 'bang',
  'control', 'hercules', 'morris', 'james1', 'tickle', 'outlaw', 'browns', 'billybob',
  'pickle', 'test1', 'michele', 'antonio', 'sucks', 'pavilion', 'changeme', 'caesar',
  'prelude', 'tanner', 'adrian', 'darkside', 'bowling', 'wutang', 'sunset', 'robbie',
  'alabama', 'danger', 'zeppelin', 'juan', 'rusty', 'pppppp', 'nick', '2001', 'ping',
  'darkstar', 'madonna', 'qwe123', 'bigone', 'casino', 'cheryl', 'charlie1', 'mmmmmm',
  'integra', 'wrangler', 'apache', 'tweety', 'qwerty12', 'bobafett', 'simone', 'none',
  'business', 'sterling', 'trevor', 'transam', 'dustin', 'harvey', 'england', '2323',
  'seattle', 'ssssss', 'rose', 'harry', 'openup', 'pandora', 'pussys', 'trucker',
  'wallace', 'indigo', 'storm', 'malibu', 'weed', 'review', 'babydoll', 'doggy',
  'dilbert', 'pegasus', 'joker', 'catfish', 'flipper', 'valerie', 'herman', 'fuckit',
  'detroit', 'kenneth', 'cheyenne', 'bruins', 'stacey', 'smoke', 'joey', 'seven',
  'marino', 'fetish', 'xfiles', 'wonder', 'stinger', 'pizza', 'babe', 'pretty',
  'stealth', 'manutd', 'gracie', 'gundam', 'cessna', 'longhorn', 'presario', 'mnbvcxz',
  'wicked', 'mustang1', 'victory', '21122112', 'shelly', 'awesome', 'athena', 'q1w2e3r4',
  'help', 'holiday', 'knicks', 'street', 'redneck', '12341234', 'casey', 'gizmo',
  'scully', 'dragon1', 'devildog', 'triumph', 'eddie', 'bluebird', 'shotgun', 'peewee',
  'ronnie', 'angel1', 'daisy', 'special', 'metallica', 'madman', 'country', 'impala',
  'lennon', 'roscoe', 'omega', 'access14', 'enterpri', 'miranda', 'search', 'smitty',
  'blizzard', 'unicorn', 'tight', 'rick', 'ronald', 'asdf1234', 'harrison', 'trigger',
  'truck', 'danny', 'home', 'winnie', 'beauty', 'thailand', '1234567890', 'cadillac',
  'castle', 'tyler', 'bobcat', 'buddy1', 'sunny', 'stones', 'asian', 'freddie',
  'chuck', 'butt', 'loveyou', 'norton', 'hellfire', 'hotsex', 'indiana', 'short',
  'panzer', 'lonewolf', 'trumpet', 'colors', 'blaster', '12121212', 'fireball',
  'logan', 'precious', 'aaron', 'elaine', 'jungle', 'atlanta', 'gold', 'corona',
  'curtis', 'nikki', 'polaris', 'timber', 'theone', 'baller', 'chipper', 'orlando',
  'island', 'skyline', 'dragons', 'dogs', 'benson', 'licker', 'goldie', 'engineer',
  'kong', 'pencil', 'basketba', 'open', 'hornet', 'world', 'linda', 'barbie',
  'chan', 'farmer', 'valentin', 'wetpussy', 'indians', 'larry', 'redman', 'foobar',
  'travel', 'morpheus', 'bernie', 'target', '141414', 'hotstuff', 'photos', 'laura',
  'savage', 'holly', 'rocky1', 'fuck_inside', 'dollar', 'turbo', 'design', 'newton',
  'hottie', 'moon', '202020', 'blondes', '4128', 'lestat', 'avatar', 'future',
  'goforit', 'random', 'abgrtyu', 'jjjjjj', 'cancer', 'q1w2e3', 'smiley', 'goldberg',
  'express', 'virgin', 'zipper', 'wrinkle1', 'stone', 'andy', 'babylon', 'dong',
  'powers', 'consumer', 'dudley', 'monkey1', 'serenity', 'samurai', '99999999',
  'bigboobs', 'skeeter', 'lindsay', 'joejoe', 'master1', 'aaaaa', 'chocolat',
  'christia', 'birthday', 'stephani', 'tang', '1234qwer', 'alfred', 'ball',
  '98765432', 'maria', 'sexual', 'maxima', '77777777', 'sampson', 'buckeye',
  'highland', 'kristin', 'seminole', 'reaper', 'bassman', 'nugget', 'lucifer',
  'airforce', 'nasty', 'watson', 'warlock', '2121', 'philip', 'always', 'dodge',
  'chrissy', 'burger', 'bird', 'snatch', 'missy', 'pink', 'gang', 'maddie',
  'holmes', 'huskers', 'piglet', 'photo', 'joanne', 'hamilton', 'dodger', 'paladin',
  'christy', 'chubby', 'buckeyes', 'hamlet', 'abcdefgh', 'bigfoot', 'sunday',
  'manson', 'goldfish', 'garden', 'deftones', 'icecream', 'blondie', 'spartan',
  'julie', 'harold', 'charger', 'brandi', 'stormy', 'sherry', 'pleasure', 'juventus',
  'rodney', 'galaxy', 'holland', 'escort', 'zxcvb', 'planet', 'jerome', 'wesley',
  'blues', 'song', 'peace', 'david1', 'ncc1701e', '1966', '51505150', 'cavalier',
  'gambit', 'karen', 'sidney', 'ripper', 'oicu812', 'jamie', 'sister', 'marie',
  'martha', 'nylons', 'aardvark', 'nadine', 'minnie', 'whiskey', 'bing', 'plastic',
  'anal', 'babylon5', 'chang', 'savannah', 'loser', 'racecar', 'insane', 'yankees1',
  'mememe', 'hansolo', 'chiefs', 'fredfred', 'freak', 'frog', 'salmon', 'concrete',
  'yvonne', 'zxcvbnm', 'yomama', 'wrestlin', 'spud', 'sputnik', 'stinky', 'sprocket',
  'sophia', 'shane', 'shelley', 'sexx', 'scorpio', 'scruffy', 'saskia', 'sanchez',
  'rocks', 'robinhood', 'richard', 'rhubarb', 'renee', 'redwing', 'reckless', 'rangers',
  'rambo', 'raleigh', 'qwer', 'puck', 'puppy', 'pumpkin', 'porsche', 'popeye',
  'poodle', 'piggy', 'petunia', 'pepper', 'peaches', 'papa', 'pancake', 'pajamas',
  'panda', 'paige', 'orwell', 'orange', 'observer', 'nutmeg', 'nugget', 'nixon',
  'nintendo', 'nina', 'nine', 'nigger', 'neptune', 'nathan', 'nascar', 'napoleon',
  'moscow', 'mortimer', 'mike', 'micheal', 'mickey', 'mets', 'mazda', 'matt',
  'mason', 'marlon', 'mario', 'marcus', 'malcolm', 'magnum', 'lynx', 'luthor',
  'lucy', 'lucifer', 'loveyou', 'loveya', 'lovey', 'lover', 'love', 'louis',
  'louise', 'logan', 'liverpool', 'lion', 'lima', 'lemon', 'leah', 'larry',
  'larson', 'kyle', 'kitty', 'king', 'khan', 'kevin', 'kenny', 'kansas',
  'juliet', 'jimmy', 'jim', 'jesus', 'jester', 'jessica', 'jeff', 'jazz',
  'jason', 'janet', 'james', 'jake', 'jade', 'jackson', 'jack', 'ivan',
  'ireland', 'irish', 'intrepid', 'icecream', 'hugh', 'hubert', 'howard', 'honey',
  'homer', 'hobbit', 'hill', 'herzog', 'henry', 'helper', 'hector', 'hawk',
  'hank', 'gregory', 'greg', 'grandma', 'grace', 'gordo', 'gordon', 'gloria',
  'glenn', 'gizmo', 'gillian', 'george', 'georgia', 'gator', 'garfield', 'gabriel',
  'fred', 'frank', 'francis', 'ford', 'floyd', 'fishing', 'fish', 'fireball',
  'fiona', 'fido', 'fender', 'feline', 'felix', 'evelyn', 'eric', 'emily',
  'edward', 'eddie', 'eaton', 'duke', 'douglas', 'donkey', 'donna', 'don',
  'doggy', 'dog', 'doctor', 'doc', 'dixie', 'dick', 'dennis', 'david',
  'danny', 'danielle', 'daniel', 'damian', 'curtis', 'cupid', 'courtney', 'cool',
  'cookie', 'conrad', 'connie', 'condor', 'colleen', 'clinton', 'clark', 'chuck',
  'chrissy', 'chris', 'chocolate', 'charlie', 'charles', 'charity', 'chad', 'cat',
  'carol', 'carolina', 'carole', 'carlos', 'carl', 'candy', 'cannon', 'camel',
  'buddy', 'buck', 'bubbles', 'bubba', 'bryan', 'bruno', 'bruce', 'brodie',
  'brittany', 'bridget', 'brian', 'brenda', 'bradley', 'brad', 'bowling', 'bowler',
  'bob', 'billy', 'bill', 'bigdog', 'bigboy', 'bessie', 'bertha', 'benson',
  'benjamin', 'ben', 'belly', 'beaver', 'beauty', 'beaker', 'bass', 'bart',
  'barney', 'barbara', 'bandit', 'banana', 'ball', 'badger', 'back', 'baby',
  'azrael', 'azrael', 'avery', 'austin', 'audrey', 'athena', 'arthur', 'arnold',
  'arnie', 'apple', 'apollo', 'antony', 'antique', 'angus', 'angie', 'angela',
  'andy', 'andrew', 'andrea', 'anderson', 'anarchy', 'analog', 'amanda', 'amber',
  'amanda', 'alex', 'alice', 'albert', 'alabama', 'africa', 'adrian', 'adam',
  'ace', 'abigail', 'abba', 'aaron', 'zorro', 'zelda', 'zebra', 'zachary',
  'yvonne', 'yolanda', 'yamaha', 'xavier', 'winston', 'winter', 'willie', 'william',
  'will', 'wheels', 'wesley', 'wendy', 'weasel', 'watson', 'wally', 'walley',
  'waldo', 'vivian', 'violet', 'viper', 'vince', 'victor', 'venus', 'veronica',
  'vermont', 'velvet', 'vanessa', 'uuuuuu', 'user', 'tyler', 'tycoon', 'tweety',
  'tuxedo', 'turtle', 'trout', 'trapper', 'tracy', 'tony', 'toni', 'tommy',
  'tom', 'todd', 'toby', 'titanic', 'tina', 'tiger', 'thursday', 'thumper',
  'thuglife', 'thomas', 'theman', 'thekid', 'test', 'terry', 'terrapin', 'taylor',
  'tattoo', 'tasha', 'tanner', 'tammy', 'sylvia', 'sweetpea', 'suzuki', 'surfer',
  'support', 'superman', 'super', 'sunshine', 'sunflowe', 'sunday', 'summer', 'sugar',
  'storm', 'stinky', 'steven', 'steve', 'steph', 'stella', 'stefan', 'speedo',
  'spencer', 'sparky', 'sparhawk', 'spalding', 'sophie', 'sonny', 'sonia', 'snoopdog',
  'snoopy', 'snake', 'smoke', 'smiley', 'slut', 'slayer', 'skylar', 'skipper',
  'simon', 'silver', 'shy', 'shovel', 'shotgun', 'shorty', 'shooter', 'sherry',
  'shell', 'shawn', 'shark', 'shannon', 'shane', 'shaggy', 'sexsex', 'sexx',
  'serpent', 'serena', 'septembe', 'sensual', 'seminole', 'sean', 'scottie', 'scott',
  'school', 'scheme', 'scarlet', 'satan', 'sarah', 'sandy', 'sandra', 'samuel',
  'sammy', 'sammie', 'sam', 'sage', 'ruth', 'russell', 'rupert', 'ruby',
  'rover', 'ross', 'rosie', 'rose', 'ronnie', 'ronald', 'rocky', 'rocks',
  'robin', 'robert', 'rob', 'roadkill', 'ripper', 'riley', 'rhonda', 'reynolds',
  'rex', 'republic', 'remote', 'regina', 'redwing', 'redrum', 'redhead', 'raven',
  'rascal', 'rambo', 'rake', 'racerx', 'racer', 'quentin', 'queen', 'qwert',
  'punk', 'pumpkin', 'puffin', 'proton', 'prometheus', 'progress', 'prince', 'primus',
  'prime', 'presley', 'preston', 'pookie', 'pooh', 'poop', 'pontiac', 'police',
  'polaris', 'poe', 'pistol', 'piss', 'piper', 'pinky', 'piglet', 'pig',
  'philip', 'phil', 'pete', 'percy', 'penny', 'pebbles', 'pearl', 'peanut',
  'peach', 'paul', 'patrick', 'pat', 'pascal', 'parrot', 'parker', 'papillon',
  'panda', 'panda', 'pamela', 'paladin', 'pacific', 'otto', 'oscar', 'orion',
  'orange', 'olivia', 'oliver', 'oicu812', 'ocean', 'nutmeg', 'nugget', 'norman',
  'norma', 'nookie', 'noodle', 'nokia', 'noble', 'nissan', 'nina', 'nikki',
  'nichole', 'nicholas', 'newton', 'newman', 'newlife', 'newborn', 'nero', 'neptune',
  'nemesis', 'nathan', 'nascar', 'napoleon', 'nancy', 'mouse', 'mortimer', 'morgan',
  'morales', 'monroe', 'monika', 'monica', 'monday', 'molly', 'mollie', 'mike',
  'mickey', 'michel', 'michael', 'metoo', 'melvin', 'melissa', 'megan', 'meatloaf',
  'meadow', 'mazda', 'matt', 'mathew', 'matrix', 'matthew', 'mary', 'marvin',
  'marley', 'mark', 'marina', 'marie', 'marcus', 'marcus', 'mario', 'marion',
  'marilyn', 'maria', 'marco', 'marc', 'manuel', 'manson', 'mallard', 'malcolm',
  'major', 'maestro', 'madmax', 'madison', 'madden', 'lynn', 'lucy', 'lucifer',
  'luciano', 'lucas', 'lowrider', 'lorraine', 'lori', 'lorenzo', 'looney', 'lonnie',
  'lola', 'logan', 'loki', 'lloyd', 'lisa', 'lion', 'lincoln', 'lilith', 'lilian',
  'light', 'lifeline', 'lester', 'lespaul', 'leroy', 'lenore', 'lennox', 'lenny',
  'lenny', 'lennon', 'laura', 'lauren', 'laura', 'larry', 'larson', 'larkin',
  'laptop', 'lance', 'lambda', 'kyle', 'kodiak', 'kitty', 'king', 'killer',
  'kevin', 'kenneth', 'kelly', 'keith', 'kathy', 'kate', 'karina', 'karate',
  'karen', 'kara', 'kangaroo', 'julian', 'julie', 'juan', 'joyce', 'joshua',
  'joseph', 'jose', 'jordan', 'jonathan', 'jon', 'johnny', 'john', 'joey',
  'joe', 'jimmy', 'jim', 'jesus', 'jerome', 'jerry', 'jessica', 'jeffrey',
  'jeff', 'jean', 'jason', 'janet', 'jan', 'jamie', 'james', 'jake',
  'jacques', 'jack', 'ivan', 'irene', 'ingrid', 'icecream', 'hunter', 'houston',
  'house', 'hotrod', 'hotdog', 'honey', 'homer', 'hobbit', 'hill', 'herman',
  'henry', 'help', 'helen', 'hector', 'hawk', 'hank', 'hannah', 'haley',
  'gwen', 'gussie', 'gunner', 'gregory', 'greg', 'gray', 'grandma', 'grace',
  'grace', 'gordon', 'golf', 'godzilla', 'god', 'gloria', 'glenn', 'gizmo',
  'gillian', 'gerry', 'george', 'georgia', 'geoffrey', 'gene', 'gehrig', 'gary',
  'gandalf', 'frankie', 'frank', 'francis', 'fox', 'four', 'foster', 'fossil',
  'forsaken', 'flying', 'floyd', 'florida', 'florence', 'fletch', 'fleming', 'flash',
  'five', 'fish', 'fire', 'finland', 'ferrari', 'fergie', 'female', 'fearless',
  'faye', 'fatboy', 'fashion', 'farmer', 'family', 'faith', 'eyeball', 'extreme',
  'everett', 'evelyn', 'eugene', 'eric', 'enigma', 'emily', 'elvis', 'elwood',
  'elizabeth', 'eliza', 'elaine', 'edward', 'edwin', 'eddie', 'eclipse', 'duke',
  'duncan', 'dulce', 'dude', 'drummer', 'drew', 'dreamer', 'dragon', 'drake',
  'douglas', 'donnie', 'donkey', 'donald', 'dog', 'dodge', 'dillon', 'dick',
  'dexter', 'devin', 'deuce', 'destiny', 'dennis', 'denise', 'demon', 'demi',
  'deluxe', 'deftones', 'deedee', 'deborah', 'debbie', 'dean', 'david', 'dave',
  'danielle', 'daniel', 'dana', 'daisy', 'daddy', 'daddy', 'cyrano', 'cyborg',
  'cynthia', 'cyrus', 'cutter', 'curtis', 'curious', 'cumming', 'cruise', 'cricket',
  'crazy', 'cowboy', 'cow', 'courtney', 'cooper', 'cool', 'cookie', 'conner',
  'connie', 'confused', 'conan', 'colonel', 'cody', 'code', 'cobra', 'clitoris',
  'clinton', 'clarence', 'cindy', 'cinema', 'christy', 'christine', 'christina', 'christie',
  'christ', 'chris', 'chocolate', 'chloe', 'chili', 'chicago', 'chester', 'cherry',
  'chelsea', 'cheetah', 'cheese', 'charlie', 'charles', 'chad', 'cessna', 'celtic',
  'cecilia', 'cat', 'carrot', 'carrie', 'carolina', 'carol', 'carnival', 'carlos',
  'carl', 'candy', 'camille', 'camel', 'caleb', 'california', 'calgary', 'buzz',
  'buster', 'bus', 'buddy', 'buck', 'bubbles', 'bubble', 'bubba', 'bryan',
  'brutus', 'bryan', 'bruce', 'brodie', 'brother', 'brittany', 'bridget', 'brian',
  'brenda', 'bradley', 'brad', 'bowling', 'bowler', 'boris', 'bobafett', 'bob',
  'billy', 'bill', 'bigred', 'bigmac', 'bigdog', 'bigboy', 'bessie', 'bertha',
  'benjamin', 'ben', 'belly', 'beaver', 'beauty', 'beaker', 'beach', 'batman',
  'bass', 'bart', 'barry', 'barney', 'barker', 'barbara', 'bandit', 'banana',
  'ball', 'badger', 'back', 'baby', 'azrael', 'austin', 'audrey', 'athena',
  'arthur', 'arnold', 'arnie', 'apple', 'apollo', 'antony', 'antique', 'angus',
  'angie', 'angela', 'andy', 'andrew', 'andrea', 'anderson', 'anarchy', 'analog',
  'amsterdam', 'amadeus', 'amanda', 'amber', 'alice', 'alicia', 'albert', 'alabama',
  'africa', 'adrian', 'adam', 'ace', 'abigail', 'abba', 'aaron', 'zorro',
  'zelda', 'zebra', 'zachary', 'yvonne', 'yolanda', 'yamaha', 'xavier', 'winston',
  'winter', 'willie', 'william', 'will', 'wheels', 'wesley', 'wendy', 'weasel',
  'watson', 'wally', 'walley', 'waldo', 'vivian', 'violet', 'viper', 'vince',
  'victor', 'venus', 'veronica', 'vermont', 'velvet', 'vanessa', 'uuuuuu', 'user',
  'tyler', 'tycoon', 'tweety', 'tuxedo', 'turtle', 'trout', 'trapper', 'tracy',
  'tony', 'toni', 'tommy', 'tom', 'todd', 'toby', 'titanic', 'tina',
  'tiger', 'thursday', 'thumper', 'thuglife', 'thomas', 'theman', 'thekid', 'test',
  'terry', 'terrapin', 'taylor', 'tattoo', 'tasha', 'tanner', 'tammy', 'sylvia',
  'sweetpea', 'suzuki', 'surfer', 'support', 'superman', 'super', 'sunshine', 'sunflowe',
  'sunday', 'summer', 'sugar', 'storm', 'stinky', 'steven', 'steve', 'steph',
  'stella', 'stefan', 'speedo', 'spencer', 'sparky', 'sparhawk', 'spalding', 'sophie',
  'sonny', 'sonia', 'snoopdog', 'snoopy', 'snake', 'smoke', 'smiley', 'slut',
  'slayer', 'skylar', 'skipper', 'simon', 'silver', 'shy', 'shovel', 'shotgun',
  'shorty', 'shooter', 'sherry', 'shell', 'shawn', 'shark', 'shannon', 'shane',
  'shaggy', 'sexsex', 'sexx', 'serpent', 'serena', 'septembe', 'sensual', 'seminole',
  'sean', 'scottie', 'scott', 'school', 'scheme', 'scarlet', 'satan', 'sarah',
  'sandy', 'sandra', 'samuel', 'sammy', 'sammie', 'sam', 'sage', 'ruth',
  'russell', 'rupert', 'ruby', 'rover', 'ross', 'rosie', 'rose', 'ronnie',
  'ronald', 'rocky', 'rocks', 'robin', 'robert', 'rob', 'roadkill', 'ripper',
  'riley', 'rhonda', 'reynolds', 'rex', 'republic', 'remote', 'regina', 'redwing',
  'redrum', 'redhead', 'raven', 'rascal', 'rambo', 'rake', 'racerx', 'racer',
  'quentin', 'queen', 'qwert', 'punk', 'pumpkin', 'puffin', 'proton', 'prometheus',
  'progress', 'prince', 'primus', 'prime', 'presley', 'preston', 'pookie', 'pooh',
  'poop', 'pontiac', 'police', 'polaris', 'poe', 'pistol', 'piss', 'piper',
  'pinky', 'piglet', 'pig', 'philip', 'phil', 'pete', 'percy', 'penny',
  'pebbles', 'pearl', 'peanut', 'peach', 'paul', 'patrick', 'pat', 'pascal',
  'parrot', 'parker', 'papillon', 'panda', 'pamela', 'paladin', 'pacific', 'otto',
  'oscar', 'orion', 'orange', 'olivia', 'oliver', 'oicu812', 'ocean', 'nutmeg',
  'nugget', 'norman', 'norma', 'nookie', 'noodle', 'nokia', 'noble', 'nissan',
  'nina', 'nikki', 'nichole', 'nicholas', 'newton', 'newman', 'newlife', 'newborn',
  'nero', 'neptune', 'nemesis', 'nathan', 'nascar', 'napoleon', 'nancy', 'mouse',
  'mortimer', 'morgan', 'morales', 'monroe', 'monika', 'monica', 'monday', 'molly',
  'mollie', 'mike', 'mickey', 'michel', 'michael', 'metoo', 'melvin', 'melissa',
  'megan', 'meatloaf', 'meadow', 'mazda', 'matt', 'mathew', 'matrix', 'matthew',
  'mary', 'marvin', 'marley', 'mark', 'marina', 'marie', 'marcus', 'mario',
  'marion', 'marilyn', 'maria', 'marco', 'marc', 'manuel', 'manson', 'mallard',
  'malcolm', 'major', 'maestro', 'madmax', 'madison', 'madden', 'lynn', 'lucy',
  'lucifer', 'luciano', 'lucas', 'lowrider', 'lorraine', 'lori', 'lorenzo', 'looney',
  'lonnie', 'lola', 'logan', 'loki', 'lloyd', 'lisa', 'lion', 'lincoln',
  'lilith', 'lilian', 'light', 'lifeline', 'lester', 'lespaul', 'leroy', 'lenore',
  'lennox', 'lenny', 'lennon', 'laura', 'lauren', 'larry', 'larson', 'larkin',
  'laptop', 'lance', 'lambda', 'kyle', 'kodiak', 'kitty', 'king', 'killer',
  'kevin', 'kenneth', 'kelly', 'keith', 'kathy', 'kate', 'karina', 'karate',
  'karen', 'kara', 'kangaroo', 'julian', 'julie', 'juan', 'joyce', 'joshua',
  'joseph', 'jose', 'jordan', 'jonathan', 'jon', 'johnny', 'john', 'joey',
  'joe', 'jimmy', 'jim', 'jesus', 'jerome', 'jerry', 'jessica', 'jeffrey',
  'jeff', 'jean', 'jason', 'janet', 'jan', 'jamie', 'james', 'jake',
  'jacques', 'jack', 'ivan', 'irene', 'ingrid', 'icecream', 'hunter', 'houston',
  'house', 'hotrod', 'hotdog', 'honey', 'homer', 'hobbit', 'hill', 'herman',
  'henry', 'help', 'helen', 'hector', 'hawk', 'hank', 'hannah', 'haley',
  'gwen', 'gussie', 'gunner', 'gregory', 'greg', 'gray', 'grandma', 'grace',
  'gordon', 'golf', 'godzilla', 'god', 'gloria', 'glenn', 'gizmo', 'gillian',
  'gerry', 'george', 'georgia', 'geoffrey', 'gene', 'gehrig', 'gary', 'gandalf',
  'frankie', 'frank', 'francis', 'fox', 'four', 'foster', 'fossil', 'forsaken',
  'flying', 'floyd', 'florida', 'florence', 'fletch', 'fleming', 'flash', 'five',
  'fish', 'fire', 'finland', 'ferrari', 'fergie', 'female', 'fearless', 'faye',
  'fatboy', 'fashion', 'farmer', 'family', 'faith', 'eyeball', 'extreme', 'everett',
  'evelyn', 'eugene', 'eric', 'enigma', 'emily', 'elvis', 'elwood', 'elizabeth',
  'eliza', 'elaine', 'edward', 'edwin', 'eddie', 'eclipse', 'duke', 'duncan',
  'dulce', 'dude', 'drummer', 'drew', 'dreamer', 'dragon', 'drake', 'douglas',
  'donnie', 'donkey', 'donald', 'dog', 'dodge', 'dillon', 'dick', 'dexter',
  'devin', 'deuce', 'destiny', 'dennis', 'denise', 'demon', 'demi', 'deluxe',
  'deftones', 'deedee', 'deborah', 'debbie', 'dean', 'david', 'dave', 'danielle',
  'daniel', 'dana', 'daisy', 'daddy', 'cyrano', 'cyborg', 'cynthia', 'cyrus',
  'cutter', 'curtis', 'curious', 'cumming', 'cruise', 'cricket', 'crazy', 'cowboy',
  'cow', 'courtney', 'cooper', 'cool', 'cookie', 'conner', 'connie', 'confused',
  'conan', 'colonel', 'cody', 'code', 'cobra', 'clitoris', 'clinton', 'clarence',
  'cindy', 'cinema', 'christy', 'christine', 'christina', 'christie', 'christ', 'chris',
  'chocolate', 'chloe', 'chili', 'chicago', 'chester', 'cherry', 'chelsea', 'cheetah',
  'cheese', 'charlie', 'charles', 'chad', 'cessna', 'celtic', 'cecilia', 'cat',
  'carrot', 'carrie', 'carolina', 'carol', 'carnival', 'carlos', 'carl', 'candy',
  'camille', 'camel', 'caleb', 'california', 'calgary', 'buzz', 'buster', 'bus',
  'buddy', 'buck', 'bubbles', 'bubble', 'bubba', 'bryan', 'brutus', 'bryan',
  'bruce', 'brodie', 'brother', 'brittany', 'bridget', 'brian', 'brenda', 'bradley',
  'brad', 'bowling', 'bowler', 'boris', 'bobafett', 'bob', 'billy', 'bill',
  'bigred', 'bigmac', 'bigdog', 'bigboy', 'bessie', 'bertha', 'benjamin', 'ben',
  'belly', 'beaver', 'beauty', 'beaker', 'beach', 'batman', 'bass', 'bart',
  'barry', 'barney', 'barker', 'barbara', 'bandit', 'banana', 'ball', 'badger',
  'back', 'baby', 'azrael', 'austin', 'audrey', 'athena', 'arthur', 'arnold',
  'arnie', 'apple', 'apollo', 'antony', 'antique', 'angus', 'angie', 'angela',
  'andy', 'andrew', 'andrea', 'anderson', 'anarchy', 'analog', 'amsterdam', 'amadeus',
  'amanda', 'amber', 'alice', 'alicia', 'albert', 'alabama', 'africa', 'adrian',
  'adam', 'ace', 'abigail', 'abba', 'aaron'
]);

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong' | 'veryStrong';
  suggestions: string[];
}

export interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  phone?: string;
  ssn?: string;
}

/**
 * Validate password according to HIPAA and NIST guidelines
 * @param password The password to validate
 * @param personalInfo Optional personal information to check against
 * @returns Validation result with errors and strength assessment
 */
export async function validatePassword(
  password: string,
  personalInfo?: PersonalInfo
): Promise<PasswordValidationResult> {
  const result: PasswordValidationResult = {
    isValid: true,
    errors: [],
    strength: 'weak',
    suggestions: []
  };

  // 1. Length requirements (NIST minimum 8, allow up to 64+)
  if (password.length < 8) {
    result.isValid = false;
    result.errors.push('Password must be at least 8 characters long');
  }

  if (password.length > 128) {
    result.isValid = false;
    result.errors.push('Password must not exceed 128 characters');
  }

  // 2. Check against common weak passwords
  if (COMMON_WEAK_PASSWORDS.has(password.toLowerCase())) {
    result.isValid = false;
    result.errors.push('Password is too common and easily guessable');
  }

  // 3. Check against personal information (HIPAA requirement)
  if (personalInfo) {
    const piiChecks = [
      { value: personalInfo.firstName, message: 'Password cannot contain your first name' },
      { value: personalInfo.lastName, message: 'Password cannot contain your last name' },
      { value: personalInfo.email?.split('@')[0], message: 'Password cannot contain your email username' },
      { value: personalInfo.phone, message: 'Password cannot contain your phone number' },
      { value: personalInfo.ssn, message: 'Password cannot contain your social security number' },
      { value: personalInfo.dateOfBirth?.replace(/[-/]/g, ''), message: 'Password cannot contain your date of birth' }
    ];

    for (const check of piiChecks) {
      if (check.value && password.toLowerCase().includes(check.value.toLowerCase())) {
        result.isValid = false;
        result.errors.push(check.message);
      }
    }
  }

  // 4. Password strength assessment
  result.strength = calculatePasswordStrength(password);
  
  // 5. Provide suggestions for stronger passwords
  result.suggestions = getPasswordSuggestions(password);

  return result;
}

/**
 * Calculate password strength based on various criteria
 * @param password The password to assess
 * @returns Strength level
 */
function calculatePasswordStrength(password: string): 'weak' | 'medium' | 'strong' | 'veryStrong' {
  if (password.length < 8) return 'weak';
  
  let score = 0;
  
  // Length scoring
  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;
  
  // Character variety scoring
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  // Bonus for longer passwords
  if (password.length >= 16) score += 1;
  if (password.length >= 20) score += 1;
  
  // Bonus for complex patterns
  if (/(.)\1{2,}/.test(password)) score -= 1; // Penalty for repeated characters
  if (/123|abc|qwe/.test(password.toLowerCase())) score -= 1; // Penalty for common sequences
  
  if (score >= 6) return 'veryStrong';
  if (score >= 4) return 'strong';
  if (score >= 2) return 'medium';
  return 'weak';
}

/**
 * Get suggestions for improving password strength
 * @param password The password to analyze
 * @returns Array of suggestions
 */
function getPasswordSuggestions(password: string): string[] {
  const suggestions: string[] = [];
  
  if (password.length < 12) {
    suggestions.push('Try a longer passphrase for stronger security');
  }
  
  if (!/[A-Z]/.test(password)) {
    suggestions.push('Consider adding uppercase letters');
  }
  
  if (!/[0-9]/.test(password)) {
    suggestions.push('Consider adding numbers');
  }
  
  if (!/[^a-zA-Z0-9]/.test(password)) {
    suggestions.push('Consider adding special characters');
  }
  
  if (password.length < 20) {
    suggestions.push('Longer passwords are harder to crack');
  }
  
  if (/(.)\1{2,}/.test(password)) {
    suggestions.push('Avoid repeating the same character multiple times');
  }
  
  if (/123|abc|qwe/.test(password.toLowerCase())) {
    suggestions.push('Avoid common character sequences');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('Great password! Consider using a password manager to store it securely');
  }
  
  return suggestions;
}

/**
 * Check if a password has been compromised in known breaches
 * In a production environment, this would integrate with HaveIBeenPwned API
 * @param password The password to check
 * @returns Promise resolving to true if password is compromised
 */
export async function isPasswordCompromised(password: string): Promise<boolean> {
  // In a real implementation, this would:
  // 1. Hash the password with SHA-1
  // 2. Send the first 5 characters to HIBP API
  // 3. Check if the full hash is in the response
  // For this implementation, we'll simulate with our common passwords list
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return COMMON_WEAK_PASSWORDS.has(password.toLowerCase());
}

/**
 * Hash a password using bcrypt
 * @param password The password to hash
 * @returns Promise resolving to hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verify a password against its hash
 * @param password The plain text password
 * @param hash The hashed password
 * @returns Promise resolving to boolean indicating match
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}