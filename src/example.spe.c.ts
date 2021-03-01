// features
class FriendsList {
    friends = [];
    addFriend(name) { //inserts a new friend to the list
        this.friends.push(name);
        this.announceFriendship(name);
    }

    announceFriendship(name) {
        global.console.log(`${name} is now a friend!`);
    }

    removeFriend(name) {
        const index = this.friends.indexOf(name);
        if (index == -1) {
            throw new Error('Friend not found!');
        }
        this.friends.splice(index, 1);
    }
}

// tests
describe('FriendsList', () => {
    let friendsList;

    beforeEach(() => {
        friendsList = new FriendsList();
    });

    it('initializes friends list', () => {
        expect(friendsList.friends.length).toEqual(0);
    });

    it('Adds a friend to the list', () => {
        friendsList.addFriend('bonitinho');
        expect(friendsList.friends.length).toEqual(1);
        expect(friendsList.friends[0]).toEqual('bonitinho');
    });

    it('Announces friendship', () => {
        friendsList.announceFriendship = jest.fn();
        expect(friendsList.announceFriendship).not.toHaveBeenCalled();
        friendsList.addFriend('bonitinho');
        expect(friendsList.announceFriendship).toHaveBeenCalled();
    });

    describe('Remove friend', () => {
        it('removes a friend from the list', () => {
            friendsList.addFriend('Ariel');
            expect(friendsList.friends[0]).toEqual('Ariel');
            friendsList.removeFriend('Ariel');    
            expect(friendsList.friends[0]).toBeUndefined();    
        });

        it('throws an error as friend does not exists', () => {
            expect(() => friendsList.removeFriend('Ariel')).toThrow(new Error('Friend not found!'));
        });
    });
});
